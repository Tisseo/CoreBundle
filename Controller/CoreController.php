<?php

namespace Tisseo\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

abstract class CoreController extends Controller
{
    /**
     * Checking access rights
     *
     * @param string $permission
     */
    protected function isGranted($permission)
    {
        if ($this->get('security.authorization_checker')->isGranted($permission) === false) {
            throw new AccessDeniedException();
        }
    }

    /**
     * Checking a request is sent from AJAX call with specified HTTP method
     *
     * @param Request $request
     * @param string $method
     */
    protected function isAjax(Request $request, $method = Request::METHOD_GET)
    {
        if (!($request->isXmlHttpRequest() && $request->isMethod($method))) {
            throw new AccessDeniedException();
        }
    }

    /**
     * Adding an error message to the session's flash bag
     *
     * @param string $error
     */
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

    /**
     * Preparing a JsonResponse
     *
     * @param array $data
     * @param integer $statusCode
     */
    protected function prepareJsonResponse($data = array(), $statusCode = Response::HTTP_OK)
    {
        $response = new JsonResponse();
        $response->setData($data);
        $response->setStatusCode($statusCode);

        return $response;
    }

    /**
     * TODO: replace calls in other bundles
     * Deprecated, we should check AJAX with other methods
     * use isAjax($request, $method) instead
     * deleted on version 2.0
     */
    protected function isPostAjax(Request $request)
    {
        if (!($request->isXmlHttpRequest() && $request->isMethod('POST')))
            throw new AccessDeniedException();
    }

    /**
     * TODO: look at DatasourceManager in EndivBundle
     * Deprecated, no replacement for the moment
     * deleted on version 2.0
     */
    protected function addBoaDatasource($datasource)
    {
        $user = $this->get('security.context')->getToken()->getUser();
        $datasource->setCode($user->getUsername());
        $datasource->setDatasource($this->get('tisseo_endiv.datasource_manager')->findDatasource('Service Données'));
    }

    /**
     * TODO: look at DatasourceManager in EndivBundle
     * Deprecated, no replacement for the moment
     * deleted on version 2.0
     */
    protected function addPaonDatasource($datasource)
    {
        $user = $this->get('security.context')->getToken()->getUser();
        $datasource->setCode($user->getUsername());
        $datasource->setDatasource($this->get('tisseo_endiv.datasource_manager')->findDatasource('Information Voyageurs'));
    }
}
