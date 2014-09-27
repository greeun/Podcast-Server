angular.module('podcast.controller')
    .controller('ItemsSearchCtrl', function ($scope, $http, $routeParams, $cacheFactory, $location, Restangular, ngstomp, DonwloadManager, ItemPerPage) {

        var tags = Restangular.all("tag"),
            numberByPage = ItemPerPage;


        $scope.loadTags = function(query) {
            return tags.post(null, {name : query});
        };

        function restangularizedItems(itemList) {
            var restangularList = [];
            angular.forEach(itemList, function (value, key) {
                restangularList.push(Restangular.restangularizeElement(Restangular.one('podcast', value.podcastId), value, 'items'));
            });
            return restangularList;
        };

        // Gestion du cache de la pagination :
        var cache = $cacheFactory.get('paginationCache') || $cacheFactory('paginationCache');

        //$scope.selectPage = function (pageNo) {
        $scope.changePage = function() {
            $scope.currentPage = ($scope.currentPage <= 1) ? 1 : ($scope.currentPage > Math.ceil($scope.totalItems / numberByPage)) ? Math.ceil($scope.totalItems / numberByPage) : $scope.currentPage;
            Restangular.one("item/search/" + $scope.term).post(null, {tags : $scope.searchTags, size: numberByPage, page : $scope.currentPage - 1, direction : $scope.direction, properties : $scope.properties}).then(function(itemsResponse) {
                $scope.items = restangularizedItems(itemsResponse.content);
                $scope.totalPages = itemsResponse.totalPages;
                $scope.totalItems = itemsResponse.totalElements;

                cache.put('search:currentPage', $scope.currentPage);
                cache.put('search:currentWord', $scope.term);
                cache.put('search:currentTags', $scope.searchTags);
                cache.put("search:direction", $scope.direction);
                cache.put("search:properties", $scope.properties);

                $location.search("page", $scope.currentPage);
            });
        };

        $scope.$on('$routeUpdate', function(){
            if ($scope.currentPage !== $location.search().page) {
                $scope.currentPage = $location.search().page || 1;
                $scope.changePage();
            }
        });

        $scope.swipePage = function(val) {
            $scope.currentPage += val;
            $scope.changePage();
        };

        $scope.remove = function (item) {
            return item.remove().then(function(){
                return $scope.changePage();
            });
        };

        // Longeur inconnu au chargement :
        $scope.totalItems = Number.MAX_VALUE;
        $scope.maxSize = 10;

        $scope.currentPage = cache.get("search:currentPage") || 1;
        $scope.term = cache.get("search:currentWord") || "";
        $scope.searchTags = cache.get("search:currentTags") || undefined;
        $scope.direction = cache.get("search:direction") || undefined;
        $scope.properties = cache.get("search:properties") || undefined;

        $scope.changePage();

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
        $scope.$on('$destroy', function () {
            $scope.wsClient.disconnect(function(){});
        });

        $scope.reset = function (item) {
            return item.reset().then(function (itemReseted) {
                var itemInList = _.find($scope.items, { 'id': itemReseted.id });
                _.assign(itemInList, itemReseted);
            });
        };

    });