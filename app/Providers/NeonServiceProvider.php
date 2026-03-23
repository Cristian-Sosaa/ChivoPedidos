<?php

namespace App\Providers;

use App\Database\NeonPostgresConnector;
use Illuminate\Support\ServiceProvider;

class NeonServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind('db.connector.pgsql', function () {
            return new NeonPostgresConnector;
        });
    }
}