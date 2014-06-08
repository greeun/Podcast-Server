(function(module) {
try {
  module = angular.module('podcast.partial');
} catch (e) {
  module = angular.module('podcast.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('html/download.html',
    '<!--<div class="jumbotron">-->\n' +
    '    <!--<div class="container">-->\n' +
    '        <!--<h1>Téléchargement</h1>-->\n' +
    '    <!--</div>-->\n' +
    '<!--</div>-->\n' +
    '\n' +
    '<div class="container downloadList">\n' +
    '\n' +
    '    <div class="row form-horizontal" style="margin-top: 15px;">\n' +
    '        <div class="col-xs-offset-1 col-md-offset-1 col-sm-offset-1 col-lg-offset-1 form-group col-md-6 col-lg-6 col-xs-6 col-sm-6 ">\n' +
    '            <label class="pull-left control-label">Téléchargements simultanés</label>\n' +
    '            <div class="col-md-3 col-lg-3 col-xs-3 col-sm-3">\n' +
    '                <input ng-model="numberOfSimDl" ng-change="updateNumberOfSimDl(numberOfSimDl)" type="number" class="form-control" placeholder="Number of download">\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="btn-group pull-right">\n' +
    '            <button ng-click="restartAllDownload()" type="button" class="btn btn-default">Démarrer</button>\n' +
    '            <button ng-click="pauseAllDownload()" type="button" class="btn btn-default">Pause</button>\n' +
    '            <button ng-click="stopAllDownload()" type="button" class="btn btn-default">Stop</button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="media"  ng-repeat="item in items track by item.id | orderBy:progression" >\n' +
    '\n' +
    '        <div class="buttonList pull-right">\n' +
    '            <br/>\n' +
    '            <button ng-click="toggleDownload(item)" type="button" class="btn btn-primary btn-sm"><i class="glyphicon glyphicon-play"></i><i class="glyphicon glyphicon-pause"></i></button>\n' +
    '            <button ng-click="stopDownload(item)" type="button" class="btn btn-danger btn-sm"><span class="glyphicon glyphicon-stop"></span></button>\n' +
    '        </div>\n' +
    '\n' +
    '        <a class="pull-left" ng-href="#/item/{{item.id}}">\n' +
    '            <img ng-src="{{item.cover.url}}" width="100" height="100" style="">\n' +
    '        </a>\n' +
    '\n' +
    '        <div class="media-body">\n' +
    '            <h5 class="media-heading">{{item.title | characters:100}}</h5>\n' +
    '            <br/>\n' +
    '            <progressbar class="progress-striped active" animate="false" value="item.progression" type="info">{{item.progression}}%</progressbar>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '\n' +
    '    <br/>\n' +
    '\n' +
    '    <accordion close-others="true">\n' +
    '        <accordion-group heading="Liste d\'attente" is-open="false">\n' +
    '\n' +
    '            <div class="media"  ng-repeat="item in waitingitems" >\n' +
    '\n' +
    '                <div class="pull-right">\n' +
    '                    <button ng-click="removeFromQueue(item)" type="button" class="btn btn-primary btn-sm"><i class="glyphicon glyphicon-minus"></i></button>\n' +
    '                </div>\n' +
    '\n' +
    '                <a class="pull-left" ng-href="#/item/{{item.id}}">\n' +
    '                    <img ng-src="{{item.cover.url}}" width="100" height="100" style="">\n' +
    '                </a>\n' +
    '\n' +
    '                <div class="media-body">\n' +
    '                    <h4 class="media-heading">{{item.title | characters:100}}</h4>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '        </accordion-group>\n' +
    '    </accordion>\n' +
    '\n' +
    '\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('podcast.partial');
} catch (e) {
  module = angular.module('podcast.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('html/item-detail.html',
    '\n' +
    '<div class="container">\n' +
    '\n' +
    '    <br/>\n' +
    '    <ol class="breadcrumb">\n' +
    '        <li><a href="/#/podcasts">Podcasts</a></li>\n' +
    '        <li><a ng-href="/#/podcast/{{ item.podcast.id }}"> {{ item.podcast.title }}</a></li>\n' +
    '        <li class="active">{{ item.title }}</li>\n' +
    '    </ol>\n' +
    '\n' +
    '    <div>\n' +
    '        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">\n' +
    '            <div class="thumbnail">\n' +
    '                <a ng-href="{{ item.localUrl || item.url }}">\n' +
    '                    <img class="center-block" ng-src="{{item.cover.url}}" width="200" height="200">\n' +
    '                </a>\n' +
    '\n' +
    '                <div class="caption">\n' +
    '\n' +
    '                    <div class="buttonList text-center">\n' +
    '                        <!-- Téléchargement en cours -->\n' +
    '                                <span ng-if="item.status == \'Started\' || item.status == \'Paused\'" >\n' +
    '                                    <button ng-click="toggleDownload(item)" type="button" class="btn btn-primary "><i class="glyphicon glyphicon-play"></i><i class="glyphicon glyphicon-pause"></i></button>\n' +
    '                                    <button ng-click="stopDownload(item)" type="button" class="btn btn-danger"><span class="glyphicon glyphicon-stop"></span></button>\n' +
    '                                </span>\n' +
    '\n' +
    '                        <!-- Lancer le téléchargement -->\n' +
    '                        <button ng-click="download(item)" ng-if="(item.status != \'Started\' && item.status != \'Paused\' ) && item.localUrl == null " type="button" class="btn btn-primary"><span class="glyphicon glyphicon-save"></span></button>\n' +
    '\n' +
    '                        <!-- Accéder au fichier -->\n' +
    '                        <a ng-href="{{ item.url }}" ng-if="item.localUrl == null" type="button" class="btn btn-info"><span class="glyphicon glyphicon-globe"></span></a>\n' +
    '                        <a ng-href="{{ item.localUrl }}" ng-if="item.localUrl != null" type="button" class="btn btn-success"><span class="glyphicon glyphicon-play"></span></a>\n' +
    '\n' +
    '                        <!-- Supprimer l\'item -->\n' +
    '                        <button ng-click="remove(item)" ng-if="(item.status != \'Started\' && item.status != \'Paused\' )" type="button" class="btn btn-danger"><span class="glyphicon glyphicon-remove"></span></button>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="col-xs-12 col-sm-12 col-md-9 col-lg-9">\n' +
    '            <br/>\n' +
    '            <div class="panel panel-default">\n' +
    '                <div class="panel-heading">\n' +
    '                    <h3 class="panel-title">{{ item.title }}</h3>\n' +
    '                </div>\n' +
    '                <div class="panel-body">\n' +
    '                    {{ item.description | htmlToPlaintext }}\n' +
    '                </div>\n' +
    '                <div class="panel-footer">Date de publication : <strong>{{item.pubdate | date : \'dd/MM/yyyy à HH:mm\' }}</strong></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('podcast.partial');
} catch (e) {
  module = angular.module('podcast.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('html/items-list.html',
    '<div class="container item-listing">\n' +
    '    <!--<div class="col-xs-11 col-sm-11 col-lg-11 col-md-11">-->\n' +
    '    <div class="col-sm-12">\n' +
    '        <tags-input placeholder="Search by Tags" add-from-autocomplete-only="true" ng-model="searchTags" display-property="name" min-length="1" class="bootstrap" on-tag-added="currentPage=1; changePage()" on-tag-removed="currentPage=1; changePage()">\n' +
    '            <auto-complete source="loadTags($query)" min-length="2"></auto-complete>\n' +
    '        </tags-input>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="text-center">\n' +
    '        <pagination items-per-page="12" max-size="10" boundary-links="true" total-items="totalItems" ng-model="currentPage" ng-change="changePage()" class="pagination pagination-centered" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;"></pagination>\n' +
    '    </div>\n' +
    '        <div class="row">\n' +
    '            <div ng-repeat="item in items track by item.id" class="col-xs-6 col-sm-4 col-md-3 col-lg-3 itemInList">\n' +
    '                <div class="box">\n' +
    '                    <div class="">\n' +
    '                        <a ng-href="#/item/{{item.id}}" >\n' +
    '                            <img ng-src="{{ item.cover.url }}" alt="" class="img-rounded img-responsive" />\n' +
    '                        </a>\n' +
    '                    </div>\n' +
    '                    <div class="text-center clearfix itemTitle" >\n' +
    '                        <p>\n' +
    '                            {{ item.title | characters:50 }}\n' +
    '                        </p>\n' +
    '                    </div>\n' +
    '                    <div class="text-center row-button">\n' +
    '                        <span ng-if="item.status == \'Started\' || item.status == \'Paused\'" >\n' +
    '                                        <button ng-click="toggleDownload(item)" type="button" class="btn btn-primary "><i class="glyphicon glyphicon-play"></i><i class="glyphicon glyphicon-pause"></i></button>\n' +
    '                                        <button ng-click="stopDownload(item)" type="button" class="btn btn-danger"><span class="glyphicon glyphicon-stop"></span></button>\n' +
    '                                    </span>\n' +
    '\n' +
    '                        <button ng-click="download(item)" ng-if="(item.status != \'Started\' && item.status != \'Paused\' ) && item.localUrl == null " type="button" class="btn btn-primary"><span class="glyphicon glyphicon-save"></span></button>\n' +
    '                        <a href="{{ item.proxyURL }}" ng-if="item.localUrl == null" type="button" class="btn btn-info"><span class="glyphicon glyphicon-globe"></span></a>\n' +
    '\n' +
    '                        <a href="{{ item.proxyURL }}" ng-if="item.localUrl != null" type="button" class="btn btn-success"><span class="glyphicon glyphicon-play"></span></a>\n' +
    '                        <button ng-click="remove(item)" ng-if="item.localUrl != null" type="button" class="btn btn-danger"><span class="glyphicon glyphicon-remove"></span></button>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    <!--</div>-->\n' +
    '    <div class="text-center row">\n' +
    '        <pagination items-per-page="12" max-size="10" boundary-links="true" total-items="totalItems" ng-model="currentPage" ng-change="changePage()" class="pagination pagination-centered" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;"></pagination>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('podcast.partial');
} catch (e) {
  module = angular.module('podcast.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('html/podcast-add.html',
    '<div class="jumbotron">\n' +
    '    <div class="container">\n' +
    '        <h1>Ajouter un Podcast</h1>\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '<div class="container">\n' +
    '    <form class="form-horizontal" role="form">\n' +
    '        <div class="form-group">\n' +
    '            <label for="title" class="col-sm-1 control-label">Titre</label>\n' +
    '\n' +
    '            <div class="col-sm-10">\n' +
    '                <input type="text" class="form-control" id="title" ng-model="podcast.title" required placeholder="Titre">\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="form-group">\n' +
    '            <label for="url" class="col-sm-1 control-label">URL</label>\n' +
    '\n' +
    '            <div class="col-sm-10">\n' +
    '                <input type="url" class="form-control" id="url" ng-model="podcast.url" required placeholder="url" ng-change="changeType()">\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="form-group">\n' +
    '            <div class="checkbox col-sm-offset-2">\n' +
    '                <label>\n' +
    '                    <input type="checkbox" ng-model="podcast.hasToBeDeleted" required> Suppression Auto\n' +
    '                </label>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="form-group">\n' +
    '            <label for="url" class="col-sm-1 control-label">Tags</label>\n' +
    '            <div class="col-sm-10">\n' +
    '                <tags-input ng-model="podcast.tags" display-property="name" min-length="1" class="bootstrap">\n' +
    '                    <auto-complete source="loadTags($query)" min-length="2"></auto-complete>\n' +
    '                </tags-input>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '\n' +
    '\n' +
    '        <div class="form-group">\n' +
    '            <label for="height" class="col-sm-1 control-label">Type</label>\n' +
    '\n' +
    '            <div class="col-sm-10">\n' +
    '                <select class="form-control" ng-model="podcast.type">\n' +
    '                    <option value="BeInSports">Be In Sports</option>\n' +
    '                    <option value="CanalPlus">Canal+</option>\n' +
    '                    <option value="JeuxVideoFR">Jeux Video Fr</option>\n' +
    '                    <option value="RSS">RSS</option>\n' +
    '                    <option value="send">Send</option>\n' +
    '                    <option value="Youtube">Youtube</option>\n' +
    '                </select>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="col-md-2 col-md-offset-1">\n' +
    '            <img ng-src="{{ podcast.cover.url }}" class="img-thumbnail" bs-Holder>\n' +
    '        </div>\n' +
    '        <div class="col-md-9">\n' +
    '            <div class="form-group">\n' +
    '                <label for="url" class="col-sm-2 control-label">URL</label>\n' +
    '\n' +
    '                <div class="col-sm-9">\n' +
    '                    <input class="form-control" id="url" ng-model="podcast.cover.url" required placeholder="url">\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="width" class="col-sm-2 control-label">Lageur</label>\n' +
    '\n' +
    '                <div class="col-sm-3">\n' +
    '                    <input type="number" class="form-control" id="width" ng-model="podcast.cover.width" required\n' +
    '                           placeholder="url">\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="height" class="col-sm-2 control-label">Hauteur</label>\n' +
    '\n' +
    '                <div class="col-sm-3">\n' +
    '                    <input type="number" class="form-control" id="height" ng-model="podcast.cover.height" required\n' +
    '                           placeholder="url">\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '\n' +
    '\n' +
    '        <div class="form-group">\n' +
    '            <div class="col-sm-offset-2 col-sm-10">\n' +
    '                <button ng-click="save()" class="btn btn-default">Sauvegarder</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </form>\n' +
    '</div>\n' +
    '\n' +
    '\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('podcast.partial');
} catch (e) {
  module = angular.module('podcast.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('html/podcast-detail.html',
    '<div class="container">\n' +
    '\n' +
    '<br/>\n' +
    '<ol class="breadcrumb">\n' +
    '    <li><a href="/#/podcasts">Podcasts</a></li>\n' +
    '    <li><a class="active"> {{ podcast.title }}</a></li>\n' +
    '</ol>\n' +
    '\n' +
    '\n' +
    '<div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">\n' +
    '    <div class="thumbnail">\n' +
    '        <img ng-src="{{podcast.cover.url}}" width="{{podcast.cover.width}}" height="{{podcast.cover.height}}" alt="">\n' +
    '        <div class="caption">\n' +
    '            <h5 class="text-center "><strong>{{ podcast.title }}</strong></h5>\n' +
    '            <p class="text-center">Nombre d\'épisode : {{podcast.items.length }}</p>\n' +
    '            <div class="col-lg-12 col-sm-12 col-md-12 col-xs-12 text-center">\n' +
    '                <button ng-click="refresh()" type="button" class="btn btn-default"><span class="glyphicon glyphicon-refresh"></span></button>\n' +
    '                <a type="button" class="btn btn-default" href="/api/podcast/{{ podcast.id }}/rss" target="_blank">RSS</a>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<div class="col-md-8 col-xs-12 col-sm-12 col-lg-8">\n' +
    '\n' +
    '    <tabset>\n' +
    '        <tab heading="Episodes">\n' +
    '            <br/>\n' +
    '\n' +
    '                <div class="media"  ng-repeat="item in podcast.items track by item.id | orderBy:pubdate">\n' +
    '\n' +
    '                    <div class="buttonList pull-right">\n' +
    '                        <!-- Téléchargement en cours -->\n' +
    '                        <span ng-if="item.status == \'Started\' || item.status == \'Paused\'" >\n' +
    '                            <button ng-click="toggleDownload(item)" type="button" class="btn btn-primary "><i class="glyphicon glyphicon-play"></i><i class="glyphicon glyphicon-pause"></i></button>\n' +
    '                            <button ng-click="stopDownload(item)" type="button" class="btn btn-danger"><span class="glyphicon glyphicon-stop"></span></button>\n' +
    '                        </span>\n' +
    '\n' +
    '                        <!-- Lancer le téléchargement -->\n' +
    '                        <button ng-click="download(item)" ng-if="(item.status != \'Started\' && item.status != \'Paused\' ) && item.localUrl == null " type="button" class="btn btn-primary"><span class="glyphicon glyphicon-save"></span></button>\n' +
    '\n' +
    '                        <!-- Accéder au fichier -->\n' +
    '                        <a href="{{ item.url }}" ng-if="item.localUrl == null" type="button" class="btn btn-info"><span class="glyphicon glyphicon-globe"></span></a>\n' +
    '                        <a href="{{ item.localUrl }}" ng-if="item.localUrl != null" type="button" class="btn btn-success"><span class="glyphicon glyphicon-play"></span></a>\n' +
    '\n' +
    '                        <!-- Supprimer l\'item -->\n' +
    '                        <button ng-click="remove(item)" ng-if="(item.status != \'Started\' && item.status != \'Paused\' )" type="button" class="btn btn-danger"><span class="glyphicon glyphicon-remove"></span></button>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <a class="pull-left" ng-href="#/item/{{item.id}}">\n' +
    '\n' +
    '                            <img ng-src="{{item.cover.url}}" width="100" height="100" style="">\n' +
    '\n' +
    '                    </a>\n' +
    '                    <div class="media-body">\n' +
    '                        <h4 class="media-heading">{{item.title | characters:60}}</h4>\n' +
    '                        <p class="description hidden-xs hidden-sm branch-name">{{item.description | htmlToPlaintext | characters : 130 }}</p>\n' +
    '                        <p><strong>{{item.pubdate | date : \'dd/MM/yyyy à HH:mm\' }}</strong></p>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '\n' +
    '\n' +
    '\n' +
    '        </tab>\n' +
    '        <tab heading="Modification">\n' +
    '\n' +
    '            <br/>\n' +
    '            <accordion close-others="true">\n' +
    '                <accordion-group heading="Podcast" is-open="true">\n' +
    '                    <form class="form-horizontal" role="form">\n' +
    '                    <div class="form-group">\n' +
    '                        <label for="title" class="col-sm-2 control-label">Titre</label>\n' +
    '                        <div class="col-sm-10">\n' +
    '                            <input type="text" class="form-control" id="title" ng-model="podcast.title" required placeholder="Titre">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div class="form-group">\n' +
    '                        <label for="url" class="col-sm-2 control-label">URL</label>\n' +
    '                        <div class="col-sm-10">\n' +
    '                            <input type="url" class="form-control" id="url" ng-model="podcast.url" required placeholder="url">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div class="form-group">\n' +
    '                        <div class="checkbox col-sm-offset-3">\n' +
    '                            <label>\n' +
    '                                <input type="checkbox" ng-model="podcast.hasToBeDeleted" required> Suppression Auto\n' +
    '                            </label>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div class="form-group">\n' +
    '                        <label for="url" class="col-sm-2 control-label">Tags</label>\n' +
    '                        <div class="col-sm-10">\n' +
    '                            <tags-input ng-model="podcast.tags" display-property="name" min-length="1" class="bootstrap">\n' +
    '                                <auto-complete source="loadTags($query)" min-length="2"></auto-complete>\n' +
    '                            </tags-input>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div class="form-group">\n' +
    '                        <label for="height" class="col-sm-2 control-label" >Type</label>\n' +
    '                        <div class="col-sm-10" >\n' +
    '                            <select class="form-control" ng-model="podcast.type">\n' +
    '                                <option value="BeInSports">Be In Sports</option>\n' +
    '                                <option value="CanalPlus">Canal+</option>\n' +
    '                                <option value="JeuxVideoFR">Jeux Video Fr</option>\n' +
    '                                <option value="RSS">RSS</option>\n' +
    '                                <option value="send">Send</option>\n' +
    '                                <option value="Youtube">Youtube</option>\n' +
    '                            </select>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <div class="form-group">\n' +
    '                        <div class="col-sm-offset-2 col-sm-10">\n' +
    '                            <button ng-click="save()" class="btn btn-default">Sauvegarder</button>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </form>\n' +
    '                </accordion-group>\n' +
    '                <accordion-group heading="Cover">\n' +
    '                    <form class="form-horizontal" role="form">\n' +
    '                    <div class="form-group">\n' +
    '                        <label for="url" class="col-sm-2 control-label">URL</label>\n' +
    '                        <div class="col-sm-10">\n' +
    '                            <input type="url" class="form-control" id="url" ng-model="podcast.cover.url" required placeholder="url">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div class="form-group">\n' +
    '                        <label for="width" class="col-sm-2 control-label">Lageur</label>\n' +
    '                        <div class="col-sm-10">\n' +
    '                            <input type="number" class="form-control" id="width" ng-model="podcast.cover.width" required placeholder="url">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div class="form-group">\n' +
    '                        <label for="height" class="col-sm-2 control-label">Hauteur</label>\n' +
    '                        <div class="col-sm-10">\n' +
    '                            <input type="number" class="form-control" id="height" ng-model="podcast.cover.height" required placeholder="url">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <div class="form-group">\n' +
    '                        <div class="col-sm-offset-2 col-sm-10">\n' +
    '                            <button ng-click="save()" class="btn btn-default">Sauvegarder</button>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                        </form>\n' +
    '                </accordion-group>\n' +
    '            </accordion>\n' +
    '\n' +
    '        </tab>\n' +
    '    </tabset>\n' +
    '\n' +
    '\n' +
    '</div>\n' +
    '    </div>\n' +
    '\n' +
    '\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('podcast.partial');
} catch (e) {
  module = angular.module('podcast.partial', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('html/podcasts-list.html',
    '<div id="listItem" class="container" style="margin-top: 15px;">\n' +
    '    <div class="row">\n' +
    '        <div class="col-xs-6 col-sm-4 col-md-3 col-lg-3" ng-repeat="podcast in podcasts">\n' +
    '            <div class="thumbnail">\n' +
    '                <a ng-href="#/podcast/{{ podcast.id }}" >\n' +
    '                    <img ng-src="{{podcast.cover.url}}" width="{{podcast.cover.width}}" height="{{podcast.cover.height}}" alt="">\n' +
    '                    <div class="caption">\n' +
    '                        <h5 class="text-center">{{ podcast.title }}</h5>\n' +
    '                    </div>\n' +
    '                </a>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '\n' +
    '');
}]);
})();

angular.module('podcastApp', [
    'podcast.controller',
    'podcast.filters',
    'podcast.services',
    'podcast.partial',
    'ngRoute',
    'restangular',
    'AngularStomp',
    'LocalStorageModule',
    'ngAnimate',
    'truncate',
    'ui.bootstrap',
    'angular-loading-bar',
    'ngTagsInput'
])
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/podcasts', {
                    templateUrl: 'html/podcasts-list.html',
                    controller: 'PodcastsListCtrl'
                }).
                when('/podcast/add', {
                    templateUrl: 'html/podcast-add.html',
                    controller: 'PodcastAddCtrl'
                }).
                when('/podcast/:podcastId', {
                    templateUrl: 'html/podcast-detail.html',
                    controller: 'PodcastDetailCtrl'
                }).
                when('/items', {
                    templateUrl: 'html/items-list.html',
                    controller: 'ItemsListCtrl'
                }).
                when('/item/:itemId', {
                    templateUrl: 'html/item-detail.html',
                    controller: 'ItemDetailCtrl'
                }).
                when('/download', {
                    templateUrl: 'html/download.html',
                    controller: 'DownloadCtrl'
                }).
                otherwise({
                    redirectTo: '/items'
                });
        }])
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }])
    .config(function(RestangularProvider) {
        RestangularProvider.setBaseUrl('/api/');
});
angular.module('podcast.controller', [])
    .controller('ItemsListCtrl', function ($scope, $http, $routeParams, $cacheFactory, Restangular, ngstomp, DonwloadManager) {

    var tags = Restangular.all("tag");
    $scope.loadTags = function() {
        return tags.getList();
    };

    // Gestion du cache de la pagination :
    var cache = $cacheFactory.get('paginationCache') || $cacheFactory('paginationCache');

    //$scope.selectPage = function (pageNo) {
    $scope.changePage = function() {
        Restangular.one("item/pagination/tags").post(null, {tags : $scope.searchTags, size: 12, page : $scope.currentPage - 1, direction : 'DESC', properties : 'pubdate'}).then(function(itemsResponse) {
            $scope.items = itemsResponse.content;
            $scope.totalItems = parseInt(itemsResponse.totalElements);
            cache.put('currentPage', $scope.currentPage);
        });
    };

    // Longeur inconnu au chargement :
    $scope.totalItems = Number.MAX_VALUE;
    $scope.maxSize = 10;
    $scope.currentPage = cache.get("currentPage") || 1;
    $scope.changePage();

    $scope.download = DonwloadManager.download;
    $scope.stopDownload = DonwloadManager.stopDownload;
    $scope.toggleDownload = DonwloadManager.toggleDownload;

    $scope.wsClient = ngstomp('/download', SockJS);
    $scope.wsClient.connect("user", "password", function(){
        $scope.wsClient.subscribe("/topic/download", function(message) {
            var item = JSON.parse(message.body);

            var elemToUpdate = _.find($scope.items, { 'id': item.id });
            if (elemToUpdate)
                _.assign(elemToUpdate, item);
        });
    });

})
    .controller('ItemDetailCtrl', function ($scope, $routeParams, $http, Restangular, ngstomp, DonwloadManager) {

        var idItem = $routeParams.itemId;

        Restangular.one("item", idItem).get().then(function(item) {
            $scope.item = item;
        }).then(function() {
            $scope.item.one("podcast").get().then(function(podcast) {

                $scope.item.podcast = podcast;

                $scope.wsClient = ngstomp("/download", SockJS);
                $scope.wsClient.connect("user", "password", function(){
                    $scope.wsClient.subscribe("/topic/podcast/" + podcast.id, function(message) {
                        var itemFromWS = JSON.parse(message.body);

                        if (itemFromWS.id == $scope.item.id) {
                            _.assign($scope.item, itemFromWS);
                        }
                    });
                });
            });

        });

        $scope.remove = function(item) {
            Restangular.one("item", item.id).remove().then(function() {
                $scope.podcast.items = _.reject($scope.podcast.items, function(elem) {
                    return (elem.id == item.id);
                });
            });
        };

        $scope.download = DonwloadManager.download;
        $scope.stopDownload = DonwloadManager.stopDownload;
        $scope.toggleDownload = DonwloadManager.toggleDownload;

})
    .controller('PodcastsListCtrl', function ($scope, Restangular, localStorageService) {

        $scope.podcasts = localStorageService.get('podcastslist');
        Restangular.all("podcast").getList().then(function(podcasts) {
            $scope.podcasts = podcasts;
            localStorageService.add('podcastslist', podcasts);
        });
})
    .controller('PodcastDetailCtrl', function ($scope, $routeParams, Restangular, ngstomp, localStorageService, DonwloadManager, $log) {

        var idPodcast = $routeParams.podcastId,
            tags = Restangular.all("tag");;

        // LocalStorage de la valeur du podcast :
        $scope.$watchGroup(['podcast', 'podcast.items'], function(newval, oldval) {
            localStorageService.add("podcast/" + idPodcast, newval[0]);
        });

        $scope.podcast = localStorageService.get("podcast/" + idPodcast ) || {};

        var refreshItems = function() {
            $scope.podcast.getList("items").then(function(items) {
                $scope.podcast.items = items;
            });
        };

        Restangular.one("podcast", $routeParams.podcastId).get().then(function(podcast) {
            podcast.items = $scope.podcast.items || [];
            $scope.podcast = podcast;


            $scope.wsClient = ngstomp("/download", SockJS);
            $scope.wsClient.connect("user", "password", function(){
                $scope.wsClient.subscribe("/topic/podcast/" + idPodcast, function(message) {
                    var item = JSON.parse(message.body);
                    var elemToUpdate = _.find($scope.podcast.items, { 'id': item.id });
                    _.assign(elemToUpdate, item);
                });
            });
        }).then(refreshItems);


        $scope.remove = function(item) {
            Restangular.one("item", item.id).remove().then(function() {
                $scope.podcast.items = _.reject($scope.podcast.items, function(elem) {
                    return (elem.id == item.id);
                });
            });
        };
        $scope.refresh = function() {
            Restangular.one("task").customPOST($scope.podcast.id, "updateManager/updatePodcast/force")
                .then(refreshItems);
        };

        $scope.loadTags = function() {
            return tags.getList();
        };

        $scope.download = DonwloadManager.download;
        $scope.stopDownload = DonwloadManager.stopDownload;
        $scope.toggleDownload = DonwloadManager.toggleDownload;

        $scope.save = function() {
            var podcastToUpdate = _.cloneDeep($scope.podcast);
            podcastToUpdate.items = null;
            $scope.podcast.patch(podcastToUpdate).then(function(patchedPodcast){
                $log.debug(patchedPodcast);
                _.assign($scope.podcast, patchedPodcast);
            });
        };
})
    .controller('DownloadCtrl', function ($scope, $http, $routeParams, Restangular, ngstomp, DonwloadManager) {
    $scope.items = Restangular.all("task/downloadManager/downloading").getList().$object;

    $scope.refreshWaitingItems = function() {
        var scopeWaitingItems = $scope.waitingitems || Restangular.all("task/downloadManager/queue");
        scopeWaitingItems.getList().then(function(waitingitems) {
            $scope.waitingitems = waitingitems;
        });
    }();

    Restangular.one("task/downloadManager/limit").get().then(function(data) {
        $scope.numberOfSimDl = parseInt(data);
    });

    $scope.updateNumberOfSimDl = DonwloadManager.updateNumberOfSimDl;

    /** Spécifique aux éléments de la liste : **/
    $scope.download = DonwloadManager.download;
    $scope.stopDownload = DonwloadManager.stopDownload;
    $scope.toggleDownload = DonwloadManager.toggleDownload;

    /** Global **/
    $scope.stopAllDownload = DonwloadManager.stopAllDownload;
    $scope.pauseAllDownload = DonwloadManager.pauseAllDownload;
    $scope.restartAllCurrentDownload = DonwloadManager.restartAllCurrentDownload;
    $scope.removeFromQueue = DonwloadManager.removeFromQueue;

    $scope.wsClient = ngstomp('/download', SockJS);
    $scope.wsClient.connect("user", "password", function(){
        $scope.wsClient.subscribe("/topic/download", function(message) {
            var item = JSON.parse(message.body);

            var elemToUpdate = _.find($scope.items, { 'id': item.id });

            switch (item.status) {
                case 'Started' :
                case 'Paused' :
                    if (elemToUpdate)
                        _.assign(elemToUpdate, item);
                    else
                        $scope.items.push(item);

                    break;
                case 'Stopped' :
                case 'Finish' :
                    if (elemToUpdate)
                        _.remove($scope.items, function(item) { return item.id === elemToUpdate.id; });
                    break;
            }
        });
        $scope.wsClient.subscribe("/topic/waitingList", function(message) {
            var items = JSON.parse(message.body);
            $scope.waitingitems = items;
        });
    });

})
    .controller('PodcastAddCtrl', function ($scope, Restangular) {
        var podcasts = Restangular.all("podcast"),
            tags = Restangular.all("tag");

        $scope.podcast = {
            hasToBeDeleted : true,
            cover : {
                height: 200,
                width: 200
            }
        };

        $scope.loadTags = function() {
            return tags.getList();
        };

        $scope.changeType = function() {
            if (/beinsports\.fr/i.test($scope.podcast.url)) {
                $scope.podcast.type = "BeInSports";
            } else if (/canalplus\.fr/i.test($scope.podcast.url)) {
                $scope.podcast.type = "CanalPlus";
            } else if (/jeuxvideo\.fr/i.test($scope.podcast.url)) {
                $scope.podcast.type = "JeuxVideoFR";
            } else if (/youtube\.com/i.test($scope.podcast.url)) {
                $scope.podcast.type = "Youtube";
            } else if ($scope.podcast.url.length > 0) {
                $scope.podcast.type = "RSS";
            } else {
                $scope.podcast.type = "Send";
            }
        };

        $scope.save = function() {
            podcasts.post($scope.podcast);
        };
});
angular.module('podcast.filters', [])
    .filter('htmlToPlaintext', function () {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '');
        };
    }
);
var podcastServices = angular.module('podcast.services', [/*'ngResource'*/]);

/*
podcastServices.factory('Podcast', ['$resource',
    function($resource){
        return $resource('/api/podcast/:podcastId', {}, {
            query: {method:'GET', params:{podcastId:''}, isArray:true}
        });
    }]);

podcastServices.factory('Item', ['$resource',
    function($resource){
        return $resource('/api/item/:itemId', {}, {
            query: {method:'GET', params:{itemId:''}, isArray:true}
        });
    }]);
*/

podcastServices.factory('DonwloadManager', function(Restangular) {
    var downloadManager = {};

    downloadManager.download = function(item) {
        Restangular.one("item").customGET(item.id + "/addtoqueue");
    };
    downloadManager.stopDownload = function(item) {
        Restangular.one("task").customPOST(item.id, "downloadManager/stopDownload");
    };
    downloadManager.toggleDownload = function(item) {
        Restangular.one("task").customPOST(item.id, "downloadManager/toogleDownload");
    };

    downloadManager.stopAllDownload = function() {
        Restangular.one("task").customGET("downloadManager/stopAllDownload");
    };
    downloadManager.pauseAllDownload = function() {
        Restangular.one("task").customGET("downloadManager/pauseAllDownload");
    };
    downloadManager.restartAllCurrentDownload = function() {
        Restangular.one("task").customGET("downloadManager/restartAllCurrentDownload");
    };
    downloadManager.removeFromQueue = function(item) {
        Restangular.one("task").customDELETE("downloadManager/queue/" + item.id);//.then($scope.refreshWaitingItems);
    };

    downloadManager.updateNumberOfSimDl = function(number) {
        Restangular.one("task").customPOST(number, "downloadManager/limit");
    };

    return downloadManager;
});