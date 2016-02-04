<?php

namespace Tisseo\CoreBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class EmailType extends AbstractType
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
        return 'email';
    }

    public function getName()
    {
        return 'tisseo_email';
    }
}
