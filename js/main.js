(function() {

	const app = angular.module("CannesStore", []);

	app.controller("CannesController", ($scope, $http) => {

		/**
		 *	Variables
		 */

		$scope.dates = [
			{name:"2016-05-14"},
			{name:"2016-05-15"},
			{name:"2016-05-16"},
			{name:"2016-05-17"},
			{name:"2016-05-18"},
			{name:"2016-05-19"},
			{name:"2016-05-20"}
		];

		/**
		 *	Listeners
		 */

		$scope.clickSeance = (filmName, filmHour, filmActive) => {

			if(filmActive === "none") {

			 	for (var date in $scope.dates) {
					for (var seance in $scope.dates[date].filmsLu) {

						if($scope.dates[date].filmsLu[seance].name === filmName) {
							$scope.dates[date].filmsLu[seance].active = "secondary";
							if($scope.dates[date].filmsLu[seance].hour === filmHour) {
								$scope.dates[date].filmsLu[seance].active = "primary";
							}
						}
					}
				}

			} else if(filmActive === "primary") {

				if(confirm("You sure ?")) {
					for (var date in $scope.dates) {
						for (var seance in $scope.dates[date].filmsLu) {

							if($scope.dates[date].filmsLu[seance].name === filmName) {
								$scope.dates[date].filmsLu[seance].active = "none";
							}
						}
					}
				}
			}
		};

		/**
		 *	Functions
		 */

		$scope.getFilms = (callback) => {

			var promise = $http.get('datas.json');

			promise.success(function(response) {
				$scope.films = response;
				if(callback) callback();
			});
		};

		$scope.makeDatesFilms = () => {

			for (var date in $scope.dates) {

				$scope.dates[date].filmsDe = [];
				$scope.dates[date].filmsLu = [];

				for (var film in $scope.films) {
					for (var projection in $scope.films[film].projections) {

						if($scope.films[film].projections[projection].date === $scope.dates[date].name) {

							// Debussy
							if($scope.films[film].projections[projection].location.substr(0, 1) === "D") {
								$scope.dates[date].filmsDe.push({
									name: $scope.films[film].name,
									author: $scope.films[film].author,
									duration: $scope.films[film].duration,
									hour: $scope.films[film].projections[projection].hour,
									demand: $scope.films[film].projections[projection].demand,
									active: "none"
								});
							}

							// Lumière
							if(
								$scope.films[film].projections[projection].location.substr(0, 1) === "L"
								&& $scope.dates[date].filmsLu.indexOf($scope.films[film]) === -1
							) {
								$scope.dates[date].filmsLu.push({
									name: $scope.films[film].name,
									author: $scope.films[film].author,
									duration: $scope.films[film].duration,
									hour: $scope.films[film].projections[projection].hour,
									demand: $scope.films[film].projections[projection].demand,
									active: "none"
								});
							}
						}
					}
				}
			}	
		};

		$scope.sortDatesFilms = () => {

			function sortNumber(a,b) {
			    return a - b;
			}

			var tmp = [];

			for (var date in $scope.dates) {
				$scope.dates[date].Lu = [];
				tmp = [];

				for (var seance in $scope.dates[date].filmsLu) {

					// console.log($scope.dates[date].filmsLu[seance]);
					tmp.push(parseInt($scope.dates[date].filmsLu[seance].hour.substr(0, 2)));
				}

				tmp.sort(sortNumber);

				for (var number in tmp) {
					if(tmp[number].length === 1) tmp[number] = "0"+tmp[number];

					for (var seance in $scope.dates[date].filmsLu) {

						if(tmp[number] === parseInt($scope.dates[date].filmsLu[seance].hour.substr(0, 2))) {
							$scope.dates[date].Lu.push($scope.dates[date].filmsLu[seance]);	
						}
					}
				}

				$scope.dates[date].filmsLu = $scope.dates[date].Lu;
			}
		};

		$scope.addBlankHours = () => {

			for (var date in $scope.dates) {

				$scope.dates[date].Lu = [];

				for (var seance in $scope.dates[date].filmsLu) {

					$scope.dates[date].Lu.push($scope.dates[date].filmsLu[seance]);

					if(typeof $scope.dates[date].filmsLu[parseInt(seance)+1] !== "undefined") {

						if(
							parseInt($scope.dates[date].filmsLu[parseInt(seance)+1].hour.substr(0, 2)) 
							- parseInt($scope.dates[date].filmsLu[seance].hour.substr(0, 2)) 
							> 4
						) {

							$scope.dates[date].Lu.push({
								name: ""
							});
						}

					} else {

						$scope.dates[date].Lu.push({
							name: ""
						});
					}					
				}

				$scope.dates[date].filmsLu = $scope.dates[date].Lu;
			}
		};

		/*
		 *	Main Function
		 */

		$scope.getFilms(function() {

			$scope.makeDatesFilms();
			$scope.sortDatesFilms();
			$scope.addBlankHours();

			console.log($scope.dates);
		});
	});

	app.directive('linkCss', () => {
		return {
			templateUrl: 'templates/link-css.html'
		};
	})

	.directive('linkMeta', () => {
		return {
			templateUrl: 'templates/link-meta.html'
		};
	})

	.directive('productFilm', () => {
		return {
			templateUrl: 'templates/product-film.html'
		};
	});

})();
