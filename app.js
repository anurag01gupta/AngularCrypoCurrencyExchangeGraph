var app = angular.module('CryptoCurrency', ['ui.bootstrap','ui.router','ngAnimate']);

app.config(function($stateProvider, $urlRouterProvider) {

    /* Add New States Above */
    $urlRouterProvider.otherwise('/home');

});

app.run(function($rootScope) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };
	
	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		if (navigator.onLine) {

		}else{
			window.alert("Network Failure");
		}
	});
});

app.factory('cryptoService', function($http){
	var cryptoService = {};
	
	var getChartData = function(){
		return $http.get("https://api.coinmarketcap.com/v1/ticker/?convert=USD&limit=10")
		.then(function(response){
			return response;	
		}, function(error){
			return error;
		});
	};
	
	cryptoService.getChartData = getChartData;
	return cryptoService;
});

app.controller('CryptoCurrencyController', ['$scope','cryptoService','$timeout','$interval', function($scope, cryptoService, $timeout, $interval){
	$scope.chartDataInfo = {
		labelsInfo: [],
		dataInfo: [],
		seriesInfo: [],
		chartData: [],
		period: 1
	};
	var ctx, myChart, autoLoadChartData;
	
	function prepareChartData(id){
		ctx = document.getElementById(id).getContext('2d');
		myChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: $scope.chartDataInfo.labelsInfo,
				datasets: [{
					label: 'Crypto Currencies in USD' + (id==="my-chart1" ? " / 1 Hour": (id==='my-chart2' ? " / 1 Day" : " / 1 Week")),
					data: $scope.chartDataInfo.dataInfo,
					borderWidth: 1,
					backgroundColor:"rgb(76, 173, 109)",
					font: 'normal 20px Helvetica',
					textAlign: 'center',
					textBaseline: 'middle',
					scaleLabel: "<%=value + '%' %>",
					legend: true
				}],
			},
			options: {
				scales: {
					xAxes: [{
						gridLines: {
							offsetGridLines: true
						}
					}],
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
			}
		});
	}
	
	function autoLoadCharData(){
		if(angular.isDefined(autoLoadChartData)){
			$interval.cancel(autoLoadChartData);
		}
		autoLoadChartData = undefined;
		if(angular.isUndefined(autoLoadChartData)){
			autoLoadChartData = $interval(function(){
				$scope.chartDataInfo.period = 1;
				$scope.getCharData();
			},300000); // call again after 5 minutes get crypto currency data updates
			autoLoadChartData.then(function() {});
		}
	}
	
	function timeoutFunction(timeout, id){
		$timeout(function(){
			prepareChartData(id);
		},timeout);
	}
	
	$scope.getCharData = function(){
		$scope.chartDataInfo.dataInfo = [];
		$scope.chartDataInfo.labelsInfo = [];
		cryptoService.getChartData().then(function(response){
			if(response.status===200){
				$scope.chartDataInfo.period = 1;
				$scope.chartDataInfo.chartData = response.data;
				angular.forEach(response.data, function(value, key){
					$scope.chartDataInfo.labelsInfo.push(value.name+" ("+value.symbol+')');
					$scope.chartDataInfo.dataInfo.push(value.percent_change_1h);
				});
				autoLoadCharData();
				timeoutFunction(200, "my-chart1");
			}
		},function(error){
			window.alert(error.data.Message);
		});
	};
//	
//	// init get data
	$scope.getCharData();
	
	$scope.buttonClick = function(period, id){
		$scope.chartDataInfo.period = period;
		$scope.chartDataInfo.dataInfo = [];
		angular.forEach($scope.chartDataInfo.chartData, function(value, key){
			if($scope.chartDataInfo.period===1){
				$scope.chartDataInfo.dataInfo.push(value.percent_change_1h);
			}
			if($scope.chartDataInfo.period===24){
				$scope.chartDataInfo.dataInfo.push(value.percent_change_24h);
			}
			if($scope.chartDataInfo.period===168){
				$scope.chartDataInfo.dataInfo.push(value.percent_change_7d);
			}
			if($scope.chartDataInfo.chartData.length-1===key){
				timeoutFunction(200, id);
			}
		});
	};
	
}]);

