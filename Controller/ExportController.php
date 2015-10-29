<?php

namespace Tisseo\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    /**
     * Exporting a CSV file using an entity manager
     * The entity manager have to provide a getCsvExport function.
     *
     * @param string $service
     */
    public function exportCsvAction($service)
    {
        $manager = $this->get($service);

        if (!is_callable(array($manager, 'getCsvExport')))
            throw new \Exception('The service used for CSV export have to provide an export function');

        $response = new StreamedResponse();
        list($content, $filename) = $manager->getCsvExport();

        $response->setCallback(function() use ($content)
        {
            $handle = fopen('php://output', 'w+');

            foreach($content as $index => $row)
            {
                if ($index == 0)
                    fputcsv($handle, array_keys($row), ';');

                $csvRow = array();
                foreach ($row as $attribute)
                {
                    if ($attribute instanceof \Datetime)
                        $csvRow[] = $attribute->format('Y-m-d');
                    else if (is_object($attribute))
                    {
                        if (is_callable(array($attribute, '__toString')))
                            $csvRow[] = $attribute;
                        else if (is_callable(array($attribute, 'getId')))
                            $csvRow[] = $attribute->getId();
                        else
                            $csvRow[] = '#error';
                    }
                    else
                        $csvRow[] = $attribute;
                }
                fputcsv($handle, $csvRow, ';');
            }

            fclose($handle);
        });

        $response->setStatusCode(200);
        $response->headers->set('Content-Type', 'application/force-download');
        $response->headers->set('Content-Disposition','attachment; filename="'.$filename.'"');

        return $response;
    }
}
