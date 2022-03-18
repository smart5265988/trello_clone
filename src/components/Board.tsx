import { useForm } from 'react-hook-form';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import DragabbleCard from './DragabbleCard';
import { ITodo, toDoState } from '../atoms';
import { useSetRecoilState } from 'recoil';

const Wrapper = styled.div`
  width: 300px;
  padding-top: 10px;
  /* border: 1px solid #404040; */
  border-radius: 30px;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
    rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
  position: relative;
  display: flex;
  flex-direction: row;
  position: relative;
  height: 40px;
  & div {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
  /* background-color: ${(props) =>
    props.isDraggingOver
      ? '#00cec9'
      : props.isDraggingFromThis
      ? '#81ecec'
      : 'transparent'}; */
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  margin: 0 auto;
  width: 80%;
`;
const Input = styled.input`
  width: 100%;
  height: 40px;
  background-color: transparent;
  border: 1px solid #00acee;
  outline: none;
  padding: 0 10px;
  border-radius: 20px;
  box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset,
    rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
  &::placeholder {
    text-align: center;
  }
`;
const DelBtn = styled.button`
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background-color: #00acee;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
    rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 20px;
  color: #fff;
`;
interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [newToDo, ...allBoards[boardId]],
      };
    });
    setValue('toDo', '');
  };

  const DeleteBoard = () => {
    // 기존 투두 복사 후
    // 복사된 객체에서 삭제할 객체를 삭제후 리턴 (현재 보드 아이디를 이용 : 객체 key값);
    setToDos((allBoards) => {
      const copyBoards = { ...allBoards };
      delete copyBoards[boardId];
      return {
        ...copyBoards,
      };
    });

    console.log(boardId);
  };
  return (
    <Wrapper>
      <Title>
        <div>{boardId}</div>
        <DelBtn onClick={DeleteBoard}>del</DelBtn>
      </Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <Input
          {...register('toDo', { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(magic, info) => (
          <Area
            isDraggingOver={info.isDraggingOver}
            isDraggingFromThis={Boolean(info.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DragabbleCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}
export default Board;
