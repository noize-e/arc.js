# ArcJS

###### [_beta_.__`v4.6.5`__]()

__ArcJS__ provides a set of modules to improve the front-end UIs development process. Designed to work with 3rd party vendor JS libraries like: __KnockoutJS__. Also is not intrusive which leds to be fully compatible with any vendor JS lib like __jQuery__.

## Features

- Forms business logic and UIs management, hand by hand with __KnockoutJS__.
- Users authentication management (username and password flow) with __Amazon Cognito__.
- RESTful C.R.U.D. request methods client, decorates the __jQuery.ajax__ method.

__Resources__

- [AWS CognitoIdentity](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html)

## Build

Firts lets create the distribution bundle. In order to do that, install node's dependencies. From command line run:

```bash
>_ npm install
```

and run:

```bash
>_ grunt proto
```

## Demo

[Demo](http://vivro-beta.s3-website-us-east-1.amazonaws.com/auth/signin.html)
