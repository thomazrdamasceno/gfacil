"use strict";
(function(){

	angular.module("adm") 

	.factory("loginUtil",function($location,cacheGet,stUtil,$localStorage,$rootScope,$cookieStore,stService,$route,$timeout,st,configUtil,filialUtil){

		var _logOut = function() {
			delete $rootScope.user;
			delete $rootScope.authToken;
			delete $rootScope.usuarioSistema;
			$cookieStore.remove('authToken');
			$cookieStore.remove('usuarioSistema')
			$location.path("/login");
		};

		var _configureSystemForUser = function(loginData, callback){
			
			//Token de acesso gerado pelo back-end
			var authToken = loginData.token;
			$rootScope.authToken = authToken;
			$cookieStore.put('authToken', authToken);

			//Informações do usuário logado
			var usuarioSistema = loginData.usuarioSistema;
			usuarioSistema.originalLogin = usuarioSistema.login;
			usuarioSistema.login = usuarioSistema.login.split('@')[0];
			$rootScope.usuarioSistema = usuarioSistema;
			$rootScope.config = loginData.config;
			$cookieStore.put('usuarioSistema', usuarioSistema);

			//Filiais disponíveis no sistema
			filialUtil.getAllFiliais(function(filiaisReturn){

				if(!filiaisReturn){
					callback();
					return;
				}
				
				//Cache offline para otimização do PDV
				cacheGet.getOfflineCache(function(){

					var idFilialInConfig = parseInt($rootScope.config.confs.currentFilialId);
					var nomeFilial = $rootScope.config.confs.labelCurrentFilial;

					if(idFilialInConfig>0){
						$rootScope.currentFilial = {id: idFilialInConfig, xNome: nomeFilial};
					}

					callback(loginData);

				}).error(function(){

					callback();

				});

			});

		}

		var _logar = function(login,lembrarSenha, callback){

			$localStorage.empresa = login.empresa;
			$localStorage.usuario = login.usuario;

			if(lembrarSenha==true)
				$localStorage.senha = login.senha;
			else{

				delete  $localStorage.senha;
			}

			//remove o token antigo
			$cookieStore.remove('authToken');

			stService.executePost("/user/login/", login).success(function(data){

				_configureSystemForUser(data, callback);

			}).error(function(data,erro){

				callback();

			});

		}

		var _isLogado = function(){

			if($rootScope.usuarioSistema)
				return true;
			else
				return false;
		}

		return{
			logar: _logar,
			logOut:_logOut,
			isLogado: _isLogado

		}
	})

})();
