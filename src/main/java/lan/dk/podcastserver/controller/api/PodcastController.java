package lan.dk.podcastserver.controller.api;

import lan.dk.podcastserver.business.PodcastBusiness;
import lan.dk.podcastserver.entity.Podcast;
import lan.dk.podcastserver.utils.jDomUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.net.MalformedURLException;
import java.util.List;

/**
 * Created by kevin on 26/12/2013.
 */
@Controller
@RequestMapping("/api/podcast")
public class PodcastController {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Resource
    private PodcastBusiness podcastBusiness;

    @RequestMapping(method = {RequestMethod.PUT, RequestMethod.POST}, produces = "application/json")
    @ResponseBody
    public Podcast create(@RequestBody Podcast podcast) {
        logger.debug("Creation of Podcast : " + podcast.toString());
        return podcastBusiness.save(podcast);
    }

    @RequestMapping(value="{id:[\\d]+}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public Podcast findById(@PathVariable int id) {
        return podcastBusiness.findOne(id);
    }

    @RequestMapping(value="{id:[\\d]+}", method = RequestMethod.PUT, produces = "application/json")
    public Podcast update(@RequestBody Podcast podcast, @PathVariable(value = "id") int id) {
        podcast.setId(id);
        return podcastBusiness.save(podcast);
    }

    @RequestMapping(value="{id:[\\d]+}", method = RequestMethod.DELETE, produces = "application/json")
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void delete (@PathVariable int id) {
        podcastBusiness.delete(id);
    }

    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    @Transactional(readOnly = true)
    public List<Podcast> findAll() {
        return podcastBusiness.findAll();
    }

    @RequestMapping(value="generatePodcastFromURL", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public Podcast generatePodcastFromURL(@RequestBody String URL) {
       return podcastBusiness.generatePodcastFromURL(URL);
    }


    @RequestMapping(value="{id:[\\d]+}/rss", method = RequestMethod.GET, produces = "application/xml; charset=utf-8")
    @ResponseBody
    public String getRss(@PathVariable int id) {
        return podcastBusiness.getRss(id);
    }
}