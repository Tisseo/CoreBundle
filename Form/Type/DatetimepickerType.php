<?php

namespace Tisseo\CoreBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class DatetimepickerType extends AbstractType
{
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(
            array(
                'format' => 'dd/MM/yyyy HH:mm',
                'widget' => 'single_text'
            )
        );
    }

    public function getParent()
    {
        return 'datetime';
    }

    public function getName()
    {
        return 'tisseo_datetimepicker';
    }
}
