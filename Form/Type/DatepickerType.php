<?php

namespace Tisseo\CoreBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class DatepickerType extends AbstractType
{
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(
            array(
                'format' => 'dd/MM/yyyy',
                'widget' => 'single_text'
            )
        );
    }

    public function getParent()
    {
        return 'date';
    }

    public function getName()
    {
        return 'tisseo_datepicker';
    }
}
