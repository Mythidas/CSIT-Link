export class Debug {
  file_name: string;

  constructor(file_name: string) {
    this.file_name = file_name;
  }

  log(func: string, msg: string) {
    console.log(`[${this.file_name}][${func}] ${msg}`);
  }
}