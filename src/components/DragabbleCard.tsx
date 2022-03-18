import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Card = styled.div<{ isDragging: boolean }>`
  border-radius: 20px;
  margin-bottom: 20px;
  width: 100%;
  height: 40px;
  background-color: #00acee;
  color: #fff;
  font-weight: 500;
  /* background-color: ${(props) =>
    props.isDragging ? '#74b9ff' : props.theme.cardColor}; */

  box-shadow: ${(props) =>
    props.isDragging ? '0px 2px 5px rgb(0,0,0,0.25)' : 'none'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface IDragabbleCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

function DragabbleCard({ toDoId, toDoText, index }: IDragabbleCardProps) {
  return (
    <Draggable draggableId={toDoId + ''} index={index}>
      {(magic, snapshot) => (
        <Card
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
          isDragging={snapshot.isDragging}
        >
          {toDoText}
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DragabbleCard);
