package lan.dk.podcastserver.business.update;


import javaslang.Tuple;
import javaslang.collection.HashSet;
import javaslang.collection.Set;
import javaslang.control.Try;
import lan.dk.podcastserver.business.CoverBusiness;
import lan.dk.podcastserver.business.PodcastBusiness;
import lan.dk.podcastserver.entity.Item;
import lan.dk.podcastserver.entity.Podcast;
import lan.dk.podcastserver.entity.Status;
import lan.dk.podcastserver.manager.worker.selector.UpdaterSelector;
import lan.dk.podcastserver.manager.worker.updater.Updater;
import lan.dk.podcastserver.repository.ItemRepository;
import lan.dk.podcastserver.service.properties.PodcastServerParameters;
import org.assertj.core.api.Condition;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.ZonedDateTime;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.function.Predicate;

import static lan.dk.podcastserver.assertion.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.AdditionalMatchers.not;
import static org.mockito.Mockito.*;

/**
 * Created by kevin on 09/08/15 for Podcast Server
 */
@RunWith(MockitoJUnitRunner.class)
public class UpdatePodcastBusinessTest {

    private static Path rootFolder = Paths.get("/tmp/podcast/");
    @Captor ArgumentCaptor<Item> ITEM_ARGUMENT_CAPTOR;

    @Mock PodcastBusiness podcastBusiness;
    @Mock ItemRepository itemRepository;
    @Mock UpdaterSelector updaterSelector;
    @Mock SimpMessagingTemplate template;
    @Mock PodcastServerParameters podcastServerParameters;
    @Spy ThreadPoolTaskExecutor updateExecutor = new ThreadPoolTaskExecutor();
    @Spy ThreadPoolTaskExecutor manualExecutor = new ThreadPoolTaskExecutor();
    @Mock Validator validator;
    @Mock CoverBusiness coverBusiness;
    @InjectMocks UpdatePodcastBusiness updatePodcastBusiness;

    @Before
    public void beforeEach() {
        Item.rootFolder = rootFolder;
        updatePodcastBusiness.setTimeOut(1, TimeUnit.SECONDS);
        updateExecutor.initialize();
        manualExecutor.initialize();
    }

    @Test
    public void should_delete_old_episode() {
        /* Given */
        when(itemRepository.findAllToDelete(any())).thenReturn(generateItems(3, new Podcast().setTitle("Title")).toJavaSet());
        /* When */
        updatePodcastBusiness.deleteOldEpisode();
        /* Then */
    }

    @Test
    public void should_reset_item_with_incorrect_state() {
        /* Given */
        HashSet<Item> items = HashSet.of(
                Item.builder().id(UUID.randomUUID()).status(Status.STARTED).build(),
                Item.builder().id(UUID.randomUUID()).status(Status.PAUSED).build()
        );
        when(itemRepository.findByStatus(anyVararg())).thenReturn(items.toJavaSet());
        /* When */
        updatePodcastBusiness.resetItemWithIncorrectState();

        /* Then */
        verify(itemRepository, times(2)).save(ITEM_ARGUMENT_CAPTOR.capture());
        assertThat(ITEM_ARGUMENT_CAPTOR.getAllValues())
                .are(new Condition<Item>() {
                    @Override
                    public boolean matches(Item value) {
                        return Status.NOT_DOWNLOADED == value.getStatus();
                    }
                });
    }
    
    @Test
    public void should_check_status_of_update() {
        assertThat(updatePodcastBusiness.isUpdating()).isFalse();
    }

    @Test
    public void should_update_podcasts() {
        /* Given */
        ZonedDateTime now = ZonedDateTime.now();
        Podcast podcast1 = new Podcast().setTitle("podcast1");
        Podcast podcast2 = new Podcast().setTitle("podcast2");
        Podcast podcast3 = new Podcast().setTitle("podcast3");
        Updater updater = mock(Updater.class);
        Set<Podcast> podcasts = HashSet.of(podcast1, podcast2, podcast3);
        when(podcastBusiness.findByUrlIsNotNull()).thenReturn(podcasts);
        when(updaterSelector.of(anyString())).thenReturn(updater);
        when(updater.notIn(any(Podcast.class))).then(i -> {
            Podcast podcast = (Podcast) i.getArguments()[0];
            return (Predicate<Item>) item -> !podcast.contains(item);
        });
        when(updater.update(eq(podcast3))).then(i -> {
            Podcast podcast = (Podcast) i.getArguments()[0];
            return Tuple.of(podcast, generateItems(10, podcast).toJavaSet(), updater.notIn(podcast));
        });
        when(updater.update(not(eq(podcast3)))).then(i -> {
            Podcast podcast = (Podcast) i.getArguments()[0];
            return Tuple.of(podcast, podcast.getItems(), updater.notIn(podcast));
        });
        when(validator.validate(any(Item.class))).thenReturn(HashSet.<ConstraintViolation<Item>>empty().toJavaSet());


        /* When */
        updatePodcastBusiness.updatePodcast();
        ZonedDateTime lastFullUpdate = updatePodcastBusiness.getLastFullUpdate();

        /* Then */
        assertThat(podcast1).hasLastUpdate(null);
        assertThat(podcast2).hasLastUpdate(null);
        assertThat(podcast3.getLastUpdate())
                .isBeforeOrEqualTo(ZonedDateTime.now())
                .isAfterOrEqualTo(now);
        assertThat(lastFullUpdate).isNotNull();

        verify(podcastBusiness, times(podcasts.size())).save(any(Podcast.class));
        verify(validator, times(10)).validate(any(Item.class));
    }

    @Test
    public void should_add_no_new_item_in_podcast_becase_every_item_already_exists() {
        /* Given */
        Item item1 = new Item();
        Item item2 = new Item();
        Item item3 = new Item();
        Podcast podcast = new Podcast()
                .setUrl("http://an.superb.url/")
                    .add(item1)
                    .add(item2)
                    .add(item3)
                .setTitle("a title");

        Updater updater = mock(Updater.class);
        when(podcastBusiness.findOne(any(UUID.class))).thenReturn(podcast);
        when(updaterSelector.of(anyString())).thenReturn(updater);
        when(updater.notIn(any(Podcast.class))).then(i -> (Predicate<Item>) item -> false);
        when(updater.update(any(Podcast.class))).then(i -> {
            Podcast podcastArgument = (Podcast) i.getArguments()[0];
            return Tuple.of(podcastArgument, generateItems(10, podcastArgument).toJavaSet(), updater.notIn(podcastArgument));
        });
        when(validator.validate(any(Item.class))).thenReturn(HashSet.<ConstraintViolation<Item>>empty().toJavaSet());

        /* When */
        updatePodcastBusiness.updatePodcast(UUID.randomUUID());

        /* Then */
        assertThat(podcast.getLastUpdate()).isNull();
    }

    @Test
    public void should_update_a_podcast() {
        /* Given */
        ZonedDateTime now = ZonedDateTime.now();
        Podcast podcast = new Podcast().setTitle("podcast1");
        Updater updater = mock(Updater.class);
        when(podcastBusiness.findOne(any(UUID.class))).thenReturn(podcast);
        when(updaterSelector.of(anyString())).thenReturn(updater);
        when(updater.notIn(any(Podcast.class))).then(i -> {
            Podcast podcastArgument = (Podcast) i.getArguments()[0];
            return (Predicate<Item>) item -> !podcastArgument.contains(item);
        });
        when(updater.update(any(Podcast.class))).then(i -> {
            Podcast p = (Podcast) i.getArguments()[0];
            return Tuple.of(p, generateItems(10, p).toJavaSet(), updater.notIn(p));
        });
        when(validator.validate(any(Item.class))).thenReturn(HashSet.<ConstraintViolation<Item>>empty().toJavaSet());


        /* When */
        updatePodcastBusiness.updatePodcast(UUID.randomUUID());

        /* Then */
        assertThat(podcast.getLastUpdate())
                .isBeforeOrEqualTo(ZonedDateTime.now())
                .isAfterOrEqualTo(now);

        verify(podcastBusiness, times(1)).save(eq(podcast));
        verify(validator, times(10)).validate(any(Item.class));
    }

    @Test
    public void should_not_handle_too_long_update() {
        /* Given */
        ThreadPoolTaskExecutor manualExecutor = new ThreadPoolTaskExecutor();
        updatePodcastBusiness = new UpdatePodcastBusiness(podcastBusiness, itemRepository, updaterSelector, template, podcastServerParameters, updateExecutor, manualExecutor, validator, coverBusiness);
        updatePodcastBusiness.setTimeOut(1, TimeUnit.SECONDS);
        manualExecutor.initialize();

        Podcast podcast1 = new Podcast().setTitle("podcast1");
        podcast1.setId(UUID.randomUUID());
        Updater updater = mock(Updater.class);
        when(podcastBusiness.findOne(any(UUID.class))).thenReturn(podcast1);
        when(updaterSelector.of(anyString())).thenReturn(updater);
        when(podcastBusiness.save(any(Podcast.class))).thenReturn(podcast1);
        when(updater.notIn(any(Podcast.class))).then(i -> {
            Podcast podcast = (Podcast) i.getArguments()[0];
            return (Predicate<Item>) item -> !podcast.contains(item);
        });
        when(updater.update(any(Podcast.class))).then(i -> {
            TimeUnit.SECONDS.sleep(15);
            Podcast podcast = (Podcast) i.getArguments()[0];
            return Tuple.of(podcast, generateItems(10, podcast).toJavaSet(), updater.notIn(podcast));
        });

        /* When */
        updatePodcastBusiness.forceUpdatePodcast(UUID.randomUUID());

        /* Then */
        assertThat(podcast1).hasLastUpdate(null);

        verify(podcastBusiness, times(2)).findOne(any(UUID.class));
        verify(podcastBusiness, times(1)).save(any(Podcast.class));
    }

    @Test
    public void should_get_number_of_active_count() {
        /* Given */
        ThreadPoolTaskExecutor updateExecutor = mock(ThreadPoolTaskExecutor.class);
        ThreadPoolTaskExecutor manualExecutor = mock(ThreadPoolTaskExecutor.class);
        updatePodcastBusiness = new UpdatePodcastBusiness(podcastBusiness, itemRepository, updaterSelector, template, podcastServerParameters, updateExecutor, manualExecutor, validator, coverBusiness);

        /* When */
        Integer numberOfActiveThread = updatePodcastBusiness.getUpdaterActiveCount();
        /* Then */
        assertThat(numberOfActiveThread).isEqualTo(0);
        verify(updateExecutor, times(1)).getActiveCount();
        verify(manualExecutor, times(1)).getActiveCount();
    }

    @Test
    public void should_delete_cover() {
        /* Given */
        Podcast podcast = Podcast.builder().id(UUID.randomUUID()).build();
        HashSet<Item> items = HashSet.of(
                Item.builder().title("Number1").podcast(podcast).build(),
                Item.builder().title("Number2").podcast(podcast).build(),
                Item.builder().title("Number3").podcast(podcast).build()
        );

        items
            .map(Item::getTitle)
            .forEach(t -> Try.run(() -> Files.createFile(Paths.get("/tmp/", t))));

        when(itemRepository.findAllToDelete(any(ZonedDateTime.class))).thenReturn(items.toJavaSet());
        when(coverBusiness.getCoverPathOf(any())).then(i -> Paths.get("/tmp/", i.getArgumentAt(0, Item.class).getTitle()));

        /* When */
        updatePodcastBusiness.deleteOldCover();

        /* Then */
        assertThat(Paths.get("/tmp/", "Number1")).doesNotExist();
        assertThat(Paths.get("/tmp/", "Number2")).doesNotExist();
        assertThat(Paths.get("/tmp/", "Number3")).doesNotExist();
    }

    private Set<Item> generateItems(Integer number, Podcast podcast) {
        return HashSet.rangeClosed(1, number)
                .map(i -> Item.builder().podcast(podcast).id(UUID.randomUUID()).fileName(i + ".mp3").build());
    }

}