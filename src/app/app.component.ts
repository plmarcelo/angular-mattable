import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Person } from './person.model';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  form: FormGroup;
  displayedColumns: string[] = ['id', 'name', 'surname', 'age', 'actions'];
  persons: Person[] = [
    {id: 1, name: "John", surname: "Smith", age: 36},
    {id: 2, name: "Sofia", surname: "Vergara", age: 47},
    {id: 3, name: "James", surname: "Belushi", age: 65},
    {id: 4, name: "Antonio", surname: "Banderas", age: 59},
    {id: 5, name: "Monica", surname: "Bellucci", age: 55}
  ];
  filteredPersons: Person[];
  dataSource: MatTableDataSource<Person>;

  filterValues = {
      name: '',
      surname: ''
  };

  nameFilter = new FormControl('');
  surnameFilter = new FormControl('');

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      data: this.fb.array([]),
    });

    this.nameFilter.valueChanges.subscribe((nameFilterValue) => {
      this.filterValues.name = nameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.surnameFilter.valueChanges.subscribe((surnameFilterValue) => {
      this.filterValues.surname = surnameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
}

  ngOnInit(): void {
    const data = this.form.controls.data as FormArray;
    this.persons.forEach(person => {
      data.push(this.fb.group({
        id: person.id,
        name: person.name,
        surname: person.surname,
        age: person.age
      }));
    });
    this.dataSource = new MatTableDataSource(this.persons);
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  customFilterPredicate() {
      return function (data: Person, filter: string): boolean {
        let searchString = JSON.parse(filter);
        let result  = data.name.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1 &&
            data.surname.toString().trim().toLowerCase().indexOf(searchString.surname.toLowerCase()) !== -1;
        return result;
      }
  }

  isDirty(index: number): boolean {
    const data = this.form.controls.data as FormArray;
    return data.at(index).dirty;
  }

  onSave(index: number) {
    console.log("Element " + index + " saved!");
  }

  trackById(index: number, item: Person) {
    console.log(item.id);
    return item.id;
  }
}
