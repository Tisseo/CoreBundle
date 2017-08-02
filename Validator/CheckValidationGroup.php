<?php

namespace Tisseo\CoreBundle\Validator;

use Symfony\Component\Form\FormInterface;

class CheckValidationGroup
{
    /**
     * Resolve validation group looking at the entity id value
     * If the entity is 'new', return [Default,Registration] else
     * return [Default,Edition]
     *
     * @param FormInterface $form
     *
     * @return array
     */
    public static function resolve(FormInterface $form)
    {
        if ($form->getData()->getId() !== null) {
            return array('Default', 'Edition');
        }

        return array('Default', 'Registration');
    }
}
