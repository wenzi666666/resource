/**
 * Angular module for frontend.examples.about component. Basically this file contains actual angular module initialize
 * and route definitions for this module.
 */
(function() {
	'use strict';

	// Define frontend.public module

	ApplicationConfiguration.registerModule('webApp.coms.tree');
	// Module configuration
	angular.module('webApp.coms.tree')
		.config(['$stateProvider',
			function($stateProvider) {
				$stateProvider
					.state('tree', {
						url: '/tree',
						data: {
							access: 0
						},
						views: {
							'content@': {
								templateUrl: '/coms/system-res/tree/views/tree.html',
								controller: 'TreeController'
							}
						}
					})
			}
		])
		.factory('Tree', ['$resource', 'Constants',
			function($resource, Constants) {
				return $resource('', {}, {
					total: {
						method: "GET",
						url: BackendUrl + "/api/discuss/home/total"
					}
				})
			}
		])
		.controller("TreeController", ['$scope', '$stateParams', '$state', '$location', 
			function($scope, $stateParams, $state, $location) {
				    function createSubTree(level, width, prefix) {
				        if (level > 0) {
				            var res = [];
				            for (var i=1; i <= width; i++)
				                res.push({ "label" : "Node " + prefix + i, "id" : "id"+prefix + i, "i": i, "children": createSubTree(level-1, width, prefix + i +".") });
				            return res;
				        }
				        else
				            return [];
				    }
								    
				 $scope.treedata=createSubTree(3, 4, "");
			     $scope.showSelected = function(sel) {
			         $scope.selectedNode = sel;
			     };
			     
			    $scope.expandedNodes = [$scope.treedata[0],
			    $scope.treedata[1],
			    $scope.treedata[2],
			    $scope.treedata[3],

			         $scope.treedata[0].children[0],
			          $scope.treedata[0].children[1],
			           $scope.treedata[0].children[2],
			            $scope.treedata[0].children[3]];
			    $scope.setExpanded = function() {
			         $scope.expandedNodes = [$scope.treedata[1],
			             $scope.treedata[2],
			             $scope.treedata[2].children[2]
			         ];
			     };
			}
		])
}());