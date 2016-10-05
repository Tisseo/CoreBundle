<?php

namespace Tisseo\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

abstract class CoreController extends Controller
{
    /**
     * Checking a request is sent from AJAX call with specified HTTP method
     *
     * @param Request $request
     * @param string $method
     */
    protected function isAjax(Request $request, $method = Request::METHOD_GET)
    {
        if (!($request->isXmlHttpRequest() && $request->isMethod($method))) {
            throw $this->createAccessDeniedException();
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
}
