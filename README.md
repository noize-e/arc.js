# ArcJS

###### [_beta_.__`v4`__]()

__ArcJS__ provides a set of modules to improve front-end UIs development. Designed to let create full interactive UIs in manner of a few minutes. Also provides a handy set of _utils functions_, _dynamic script importing__ and _user authentication__.

## Getting Started

Firts lets create the distribution bundle. In order to do that, install node's dependencies. From command line run:

```bash
>_ npm install
```

The install [__Grunt__](https://gruntjs.com/) and run:

```bash
>_ grunt
```

__Obfuscated version__

If you want to create a ofuscated distribution, run:

```bash
>_ grunt prod
```

### Create a User Interface

Place the following `<script>`s near the end of your pages, right before the closing `</body>` tag, to enable them.

```html
<script src="../dist/arc-4.5.0.min.js"></script>
```

__Note__ The library require the use of KnockoutJS and Amazon Cognito SDK.

## Testing

It had been added a behavior-driven testing framework: [__jasmine__](https://jasmine.github.io/index.html).

Test specs are located at `src/test` directory.

__Note__ Some module's specs are still on development.

To execute the specs from the root of the project run:

```bash
>_ npx jasmine --config=jasmine.json
```

To see the installation process check it out theirs [documentation](https://jasmine.github.io/setup/nodejs.html).