import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDoState, AddBoardModal } from './atoms';
import Board from './components/Board';
import { useForm } from 'react-hook-form';
const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  max-width: 1800px;
`;
const H1 = styled.h1`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #00acee;
  color: #fff;
  font-size: 45px;
  font-weight: 600;
  margin-bottom: 20px;
  position: relative;
`;
const Boards = styled.div`
  padding: 2%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const Button = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  cursor: pointer;
  color: #00acee;
  font-size: 30px;
  font-weight: 600;
  background-color: #fff;
`;
const Modal = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: #000000;
  z-index: 22;
  top: 0;
  left: 0;
`;

const AddBoard = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.bgColor};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  & form {
    width: 80%;
    display: flex;
    flex-direction: column;
  }
`;
const BoardName = styled.input`
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
`;
const BoardNameBtn = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: tomato;
  color: #fff;
`;

const Footer = styled.footer`
  width: 100%;
  height: 30px;
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 11px;
  font-weight: 500;
  /* background-color: #00acee; */
`;
interface IBoardName {
  name: string;
}

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [isModal, setModal] = useRecoilState(AddBoardModal);
  const { register, handleSubmit, setValue } = useForm<IBoardName>();
  // 이름 입력후 엔터 입력시 모달창 닫고 투두 리스트에 새로운 리스트 생성, 모달창 인풋 초기화
  const onVaild = ({ name }: IBoardName) => {
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [name]: [],
      };
    });
    setValue('name', '');
    setModal(() => {
      return {
        isOpen: false,
      };
    });
  };
  //플러스 버튼 클릭시 모달창 오픈
  const addBoard = () => {
    setModal(() => {
      return {
        isOpen: true,
      };
    });
  };
  //모달창 닫는 함수
  const ModalCtrl = () => {
    console.log('dd');
    setModal(() => {
      return {
        isOpen: false,
      };
    });
  };
  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // same board movement.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (destination.droppableId !== source.droppableId) {
      // cross board movement
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };

  console.log(Object.keys(toDos).length);
  return (
    <div
      style={{
        // border: '1px solid red',
        position: 'relative',
        height: '100vh',
      }}
    >
      <H1>
        Hello, Trello Clone
        {Object.keys(toDos).length >= 5 ? (
          <></>
        ) : (
          <Button onClick={addBoard}>+</Button>
        )}
      </H1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Boards>
            {Object.keys(toDos).map((boardId) => (
              <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
            ))}
          </Boards>
        </Wrapper>
      </DragDropContext>
      {isModal.isOpen === true ? (
        <Modal>
          <AddBoard>
            <form onSubmit={handleSubmit(onVaild)}>
              <span>추가하실 보드명을 입력해주세요</span>
              <BoardName
                {...register('name', {
                  required: true,
                })}
                type="text"
                placeholder={`Add Board Name`}
              ></BoardName>
            </form>
            <BoardNameBtn onClick={ModalCtrl}>close</BoardNameBtn>
          </AddBoard>
        </Modal>
      ) : (
        <></>
      )}
      <Footer>2022_03 Trello Clone - KYG toy project</Footer>
    </div>
  );
}

export default App;
