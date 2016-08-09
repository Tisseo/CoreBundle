<?php

namespace Tisseo\CoreBundle\Security\Authentification;

use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Doctrine\Bundle\DoctrineBundle\Registry as Doctrine;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Router;
use Symfony\Component\HttpFoundation\Session\Session;

use CanalTP\SamCoreBundle\Component\Authentication\Handler\LoginSuccessHandler as SamLoginSuccessHandler:

class LoginSuccessHandler extends SamLoginSuccessHandler {

    public function onAuthenticationSuccess(Request $request, TokenInterface $token)
    {
        $user = $token->getUser();
        $userRoles = $user->getUserRoles();

        foreach ($userRoles as $role) {
            $defaultRoute = $role->getApplication()->getDefaultRoute();
            if (!is_null($defaultRoute)) {
                $defaultRoute = $this->router->match($defaultRoute);

                return new RedirectResponse($this->router->generate($defaultRoute['_route']));
            }
        }

        return new RedirectResponse($this->router->generate('canal_tp_sam_homepage'));
    }

}
