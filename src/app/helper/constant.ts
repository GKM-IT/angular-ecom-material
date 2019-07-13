export class Constant {
   public topLoader = false;
   public autocompleteListSize = 10;
   public pageSizeOptions: number[] = [5, 10, 25, 50, 100];
   public priceTypes = [
      {
         value: 'FIXED',
         text: 'Fixed',
      },
      {
         value: 'WEIGHT',
         text: 'Weight',
      },
      {
         value: 'LENGTH',
         text: 'Length',
      },
      {
         value: 'HOUR',
         text: 'Hour',
      },
   ];
}