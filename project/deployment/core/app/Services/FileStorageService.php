<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileStorageService
{
    public function storePdf(UploadedFile $file): string
    {
        // Placeholder
        return Storage::disk('public')->putFile('materials', $file);
    }
}
