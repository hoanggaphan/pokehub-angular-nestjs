import { Component, EventEmitter, Output, inject } from '@angular/core';
import PokemonService from '../../../services/pokemon.service';
import AuthService from '../../../services/auth.service';

@Component({
  selector: 'app-import',
  imports: [],
  templateUrl: './import.html',
  styleUrl: './import.css',
})
export class Import {
  private pokemonService = inject(PokemonService)
  private authService = inject(AuthService)

  @Output() imported = new EventEmitter<void>()

  file?: File
  uploading = false

  trigger(input: HTMLInputElement) {
    if (!this.authService.isLogged()) {
      alert('Vui lòng đăng nhập để import CSV')
      return
    }
    input.click()
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      const selected = input.files[0]
      if (!this.isCsvFile(selected)) {
        alert('Chỉ chấp nhận file CSV (.csv)')
        input.value = ''
        this.file = undefined
        return
      }
      this.file = selected
      this.upload()
    }
  }

  private isCsvFile(file: File): boolean {
    const nameLower = file.name.toLowerCase()
    const typeLower = (file.type || '').toLowerCase()
    const csvMimeTypes = ['text/csv', 'application/csv', 'application/x-csv', 'text/comma-separated-values', 'application/vnd.ms-excel']
    return nameLower.endsWith('.csv') || csvMimeTypes.includes(typeLower)
  }

  private upload() {
    if (!this.file) return
    this.uploading = true
    this.pokemonService.importCsv(this.file).subscribe({
      next: () => {
        this.uploading = false
        alert('Import thành công!')
        this.imported.emit()
        this.file = undefined
      },
      error: (err) => {
        this.uploading = false
        alert(err?.error?.message || 'Import thất bại')
      }
    })
  }
}
