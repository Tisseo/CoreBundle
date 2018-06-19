<?php

namespace Tisseo\CoreBundle\Security\Authentification;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use CanalTP\SamCoreBundle\Component\Authentication\Handler\LoginSuccessHandler as SamLoginSuccessHandler;

/**
 * Class LoginSuccessHandler
 */
class LoginSuccessHandler extends SamLoginSuccessHandler
{
    /**
     * @param Request        $request
     * @param TokenInterface $token
     *
     * @return RedirectResponse
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token)
    {
        $user = $token->getUser();
        $userRoles = $user->getUserRoles();

        foreach ($userRoles as $role) {
            $defaultRoute = $role->getApplication()->getDefaultRoute();
            if (!is_null($defaultRoute)) {
                // Hack for redirect to archive page
                if ($role->getApplication()->getName() === 'Ogive' && $role->getCanonicalName() === 'ROLE_LECTURE_SEULE_OGIVE') {
                    $defaultRoute = $this->router->match('/ogive/events/history');
                } else {
                    $defaultRoute = $this->router->match($defaultRoute);
                }

                return new RedirectResponse($this->router->generate($defaultRoute['_route']));
            }
        }

        return new RedirectResponse($this->router->generate('canal_tp_sam_homepage'));
    }
}
