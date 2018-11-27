export class List {
  _id: string;
  userID: string;
  name: string;
  description: string;
  isPublic: boolean;
  username: string;
}

export class ListItem {
  _id: string;
  listID: string;
  itemName: string;
  quantity: number;
  itemID: string;
}
