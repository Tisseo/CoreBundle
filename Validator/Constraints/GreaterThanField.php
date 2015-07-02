<?php

namespace Tisseo\CoreBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class GreaterThanField extends Constraint
{
    public $field = null;
    public $message = 'error.greater_than_field';
}
