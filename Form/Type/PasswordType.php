<?php

namespace Tisseo\CoreBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class PasswordType extends AbstractType
{
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(
            array(
                'widget' => 'single_text'
            )
        );
    }

    public function getParent()
    {
        return 'password';
    }

    public function getName()
    {
        return 'tisseo_password';
    }
}
