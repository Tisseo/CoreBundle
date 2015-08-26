<?php

namespace Tisseo\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\Request;

abstract class CoreController extends Controller
{
    protected function isGranted($businessId)
    {
        if ($this->get('security.context')->isGranted($businessId) === false)
            throw new AccessDeniedException();
    }

    protected function isPostAjax(Request $request)
    {
        if (!($request->isXmlHttpRequest() && $request->isMethod('POST')))
            throw new AccessDeniedException();
    }

    // TODO: This is ugly, change it. @see DatasourceManager in EndivBundle
    protected function buildDefaultDatasource($datasource)
    {
        $user = $this->get('security.context')->getToken()->getUser();
        $datasource->setCode($user->getUsername());
        $datasource->setDatasource($this->get('tisseo_endiv.datasource_manager')->findDefaultDatasource());
    }

    protected function addFlashException($error)
    {
        $this->addFlash(
            'danger',
            $this->get('translator')->trans(
                'tisseo.flash.error.exception',
                array('%error%' => $error),
                'messages'
            )
        );
    }
}
