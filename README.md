README
======

Description
-----------

CoreBundle is the core bundle providing common views and resources.
It is used by BoaBundle and PaonBundle.

Requirements
------------

- PHP 5.4.3

Installation
------------

1. composer.json:

'''
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
'''

2. AppKernel.php

'''
    $bundles = array(
        new Tisseo\CoreBundle\TisseoCoreBundle(),
        // ...
    );
'''

Configuration
-------------

You don't need to do this if you're working with the main bundle NMM which
provides all this configuration already.

Contributing
------------

1. Vincent Passama - vincent.passama@gmail.com
