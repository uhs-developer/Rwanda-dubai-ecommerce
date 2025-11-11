<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TaxRate;
use App\Models\ShippingMethod;
use App\Models\Coupon;
use Illuminate\Http\Request;

class ConfigurationController extends Controller
{
    public function index()
    {
        $tenant = app('tenant');

        $taxRatesCount = TaxRate::where('tenant_id', $tenant->id)->count();
        $shippingMethodsCount = ShippingMethod::where('tenant_id', $tenant->id)->count();
        $couponsCount = Coupon::where('tenant_id', $tenant->id)->count();

        return view('admin.configuration.index', compact('taxRatesCount', 'shippingMethodsCount', 'couponsCount'));
    }

    public function taxes()
    {
        $tenant = app('tenant');

        $taxRates = TaxRate::where('tenant_id', $tenant->id)
            ->orderBy('name')
            ->get();

        return view('admin.configuration.taxes', compact('taxRates'));
    }

    public function shipping()
    {
        $tenant = app('tenant');

        $shippingMethods = ShippingMethod::where('tenant_id', $tenant->id)
            ->with('rates')
            ->orderBy('name')
            ->get();

        return view('admin.configuration.shipping', compact('shippingMethods'));
    }

    public function coupons()
    {
        $tenant = app('tenant');

        $coupons = Coupon::where('tenant_id', $tenant->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return view('admin.configuration.coupons', compact('coupons'));
    }
}
