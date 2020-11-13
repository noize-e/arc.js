ARC
===

###### [__`beta v4`__]

__ARC.js__ is a Javascript library that improves the responsive UIs creation process adding some type of decorator functionality to knockout's observers. In other words, KO is in charge of binding the data through observers while ARC keeps a manifest of them for better management.

Features
--------

### Third-Party APIs

The library had been upgraded with quite nice features, from user authentication to payment runways. So, the 3rd party APIs supported are:

1.  Amazon Cognito User Pools for authentication through:
    a. Username/email - password
    b. [Facebook Login](https://developers.facebook.com/docs/facebook-login)
    c. [Google Login](https://developers.google.com/identity)

    For more information, see [Amazon Cognito documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-social-idp.html)

Distribution
------------

- The library is compiled and packaged with Grunt.

Tests
-----

- Jasmine testing framwork
