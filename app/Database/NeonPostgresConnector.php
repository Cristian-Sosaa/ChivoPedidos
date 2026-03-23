<?php

namespace App\Database;

use Illuminate\Database\Connectors\PostgresConnector;

class NeonPostgresConnector extends PostgresConnector
{
    protected function getDsn(array $config)
    {
        $dsn = parent::getDsn($config);

        if (isset($config['neon_endpoint'])) {
            $dsn .= ";options='endpoint=" . $config['neon_endpoint'] . "'";
        }

        return $dsn;
    }
}