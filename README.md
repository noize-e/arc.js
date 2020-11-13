# arc.js

###### [_beta_.__`v4`__]()

__Arc.js__ provides a set of modules for improve the development of the ui's interactive logic. The library was designed to take advantage of 3rd party frameworks power, allowing to create an interactive interface in just a few minutes.

## Dependencies

The project was designed to work with 3rd party libraries. the following are the ones that are used in a hard way:

- [knockout.js]()
- [AWS Cognito SDK]()
- [jQuery]()

## Test

Unlike version 3 in this version has been added a behavior-driven testing framework: [__jasmine__](https://jasmine.github.io/index.html). The test specs for each module are located at `src/test` directory.

__Note__ Some module's specs are still on development.

To execute the specs from the root of the project run:

```bash
>_ npx jasmine --config=jasmine.json
```

To see the installation process check it out theirs [documentation](https://jasmine.github.io/setup/nodejs.html).

## Distribution

To create the distribution source files, install [__Grunt__](https://gruntjs.com/).

For the installation process check it's [documenation](). The runner dependencies are defined inside __package.json__ and the tasks inside __Gruntfile.js__.

Well, once installed simply run from the root of the project:

```bash
>_ grunt
```

#### Obfuscated

If you want to create a ofuscated distribution, run:

```bash
>_ grunt prod
```

#### Vendor

To create a distro with packaging the following libraries: __jQuery__, __Bootstrap__, __Popper__, __knockout__ and __Cognito's sdk__ run:

```bash
>_ grunt vendor
```
