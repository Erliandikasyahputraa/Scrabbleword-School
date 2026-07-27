<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Material;

class MaterialPolicy
{
    public function update(User $user, Material $material): bool
    {
        // Placeholder
        return true;
    }
}
