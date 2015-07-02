<?php

namespace Tisseo\CoreBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

/**
 * GreaterThanFieldValidator
 */
class GreaterThanFieldValidator extends ConstraintValidator
{
    /**
     * Checks if the passed value is valid.
     *
     * @param mixed      $value      The value that should be validated
     * @param Constraint $constraint The constrain for the validation
     *
     * @return Boolean Whether or not the value is valid
     */
    public function validate($value, Constraint $constraint)
    {
        $field = $this->context->getRoot()->get($constraint->field);

        if ($value !== null && $value <= $field->getData()) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('%string%', $value->format('d/m/Y'))
                ->setParameter('%field%', $constraint->field)
                ->addViolation();
        }
    }
}
