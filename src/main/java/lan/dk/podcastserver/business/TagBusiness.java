package lan.dk.podcastserver.business;

import lan.dk.podcastserver.entity.Tag;
import lan.dk.podcastserver.repository.TagRepository;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.transaction.Transactional;
import java.util.*;

/**
 * Created by kevin on 07/06/2014.
 */
@Component
@Transactional
public class TagBusiness {

    @Resource
    TagRepository tagRepository;

    public List<Tag> findAll() {
        return tagRepository.findAll();
    }

    public Tag findOne(Integer integer) {
        return tagRepository.findOne(integer);
    }

    public Set<Tag> getTagListByName(Set<Tag> tagList) {
        Collection<String> tagsName = new ArrayList<>();
        Set<Tag> tagResult = new HashSet<>();

        for(Tag tag : tagList) {
            if (tag.getId() != null) {
                Tag tmpTag = tagRepository.findByName(tag.getName());
                if (tmpTag == null ) {
                    tagResult.add(tmpTag);
                } else {
                    tagsName.add(tag.getName());
                }
            } else {
                tagResult.add(tag);
            }
        }
        tagResult.addAll(tagRepository.findByNameIn(tagsName));
        return tagResult;
    }
}