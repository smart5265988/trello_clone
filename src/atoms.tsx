import { atom } from 'recoil';

export interface ITodo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: ITodo[];
}

export const toDoState = atom<IToDoState>({
  key: 'toDo',
  default: {},
});

interface IModal {
  isOpen: boolean;
}

export const AddBoardModal = atom<IModal>({
  key: 'Modal',
  default: {
    isOpen: false,
  },
});
