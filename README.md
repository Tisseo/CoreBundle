Core
====

Description
-----------

CoreBundle is providing common resources to
[Tisseo](https://github.com/Tisseo) Symfony2 bundles.

Requirements
------------

- PHP 5.3+
- Symfony 2.6.x

Installation
------------

1. composer.json:

```
    "repositories": [
        {
            "type": "git",
            "url": "https://github.com/Tisseo/CoreBundle.git"
        },
        //...
    ],
    "require": {
        "tisseo/core-bundle": "dev-master",
        // ...
    }
```

2. AppKernel.php

```
    $bundles = array(
        new Tisseo\CoreBundle\TisseoCoreBundle(),
        // ...
    );
```

Contributing
------------

1. Vincent Passama - vincent.passama@gmail.com
