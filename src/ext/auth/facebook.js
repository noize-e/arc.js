(function arc_ext_facebook_login(global, $, XHRClient) {
  const FacebookLogin = function FacebookLogin() {
    let code; let id_token; let access_token; let authClient;

    const getUserData = function getUserData(access_token) {
      const eventTrigger = this.on;

      authClient.setContentType('application/json');
      authClient.setAuthorization('Bearer ' + access_token);
      authClient.get('/oauth2/userInfo', {},
          function(data, status) {
            switch (status) {
              case 'error':
                global.Session.destroy();
                eventTrigger('Close_Session');
                break;
              default:
                Object.keys(data).forEach(function(key) {
                  global.Session.add(key, data[key]);
                });
                eventTrigger('User_Info_Loaded');
                break;
            }
          },
      );
    };

    this.checkSession = function checkSession() {
      code = global.getUrlParam('code', null);

      id_token = global.Session.getIdToken();
      access_token = global.Session.getAccessToken();

      authClient = new XHRClient();
      authClient.setRequestHandler($.ajax);
      authClient.setApiSettings(null, global.cognitoConfig.domain);
      authClient.setContentType('application/x-www-form-urlencoded');

      if (code != null) {
        authClient.post('/oauth2/token', null, {
          grant_type: 'authorization_code',
          client_id: global.cognitoConfig.clientId,
          redirect_uri: global.cognitoConfig.redirectUri,
          code: code,
        }, function onComplete(data, status) {
          switch (status) {
            case 'error':
              global.Session.destroy();
              this.on('Token_Load_Error');
              break;
            case 'success':
              global.Session.create(data);
              getUserData.call(this, data.access_token);
              this.on('Token_Loaded');
              break;
          }
        }.bind(this));
      }

      if (id_token != null && access_token != null) {
        getUserData.call(this, access_token);
      }
    };
  };

  global.FacebookLogin = new FacebookLogin();
})(this, jQuery, XHRClient);
