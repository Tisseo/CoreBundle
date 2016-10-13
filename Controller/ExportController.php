<?php

namespace Tisseo\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Tisseo\EndivBundle\Services\CsvExportInterface;

class ExportController extends Controller
{
    /**
     * Exporting a CSV file using an entity manager
     * The entity manager have to provide a getCsvExport function.
     *
     * @param string $service
     */
    public function exportCsvAction($service, $option)
    {
        $manager = $this->getExportService($service);

        $response = new StreamedResponse();
        list($content, $filename) = $manager->getCsvExport($option);

        $this->prepareCsvResponse($response, $content);

        $response->setStatusCode(StreamedResponse::HTTP_OK);
        $response->headers->set('Content-Type', 'application/force-download');
        $response->headers->set('Content-Disposition','attachment; filename="'.$filename.'.csv"');

        return $response;
    }

    /**
     * Put content into the StreamedResponse
     *
     * @param StreamedResponse $response
     * @param mixed $content
     */
    private function prepareCsvResponse(StreamedResponse $response, $content)
    {
        $response->setCallback(function() use ($content) {
            $handle = fopen('php://output', 'w+');
            fwrite($handle, "\xEF\xBB\xBF"); // adds BOM utf8 fox Excel

            foreach($content as $index => $row) {
                if ($index == 0) {
                    fputcsv($handle, array_keys($row), ';');
                }

                $csvRow = array();
                foreach ($row as $attribute) {
                    if ($attribute instanceof \Datetime) {
                        $csvRow[] = $attribute->format('Y-m-d');
                    } else if (is_object($attribute)) {
                        if (is_callable(array($attribute, '__toString'))) {
                            $csvRow[] = $attribute;
                        } else if (is_callable(array($attribute, 'getId'))) {
                            $csvRow[] = $attribute->getId();
                        } else {
                            $csvRow[] = '#error';
                        }
                    } else {
                        $csvRow[] = $attribute;
                    }
                }
                fputcsv($handle, $csvRow, ';');
            }

            fclose($handle);
        });
    }

    /**
     * Get a service and check it implements CsvExportInterface
     *
     * @param  string $service
     * @return CsvExportInterface
     */
    private function getExportService($service)
    {
        $manager = $this->get($service);

        if (!$manager instanceof CsvExportInterface) {
            throw new \Exception('The service used for CSV export have to provide an export function');
        }

        return $manager;
    }
}
