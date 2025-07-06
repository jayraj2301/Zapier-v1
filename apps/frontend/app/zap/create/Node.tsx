import React from 'react';
import { Plus } from 'lucide-react';
import { BaseEdge, getStraightPath, Handle, Position } from '@xyflow/react';
 
export default function CustomNode({data}: {data: {label: string, index?: number}}) {
    return (
    <>
      <div className='bg-amber-100 p-3 w-72 rounded-xl shadow-[0_10px_10px_rgba(0,0,0,0.25)]'>
        <p className='text-lg'>
            {data.index}. {data.label}
        </p>
        <Handle type="source" position={Position.Top} id="a" style={{ display: 'none' }} />

      {/* Target handle (incoming edge) */}
      <Handle type="target" position={Position.Bottom} id="b" style={{ display: 'none' }} />
      </div>
    </>
  );
}

export function AddNode({data}: {data: { onClick: () => void }}) {
    return (
        <button className='p-2 hover:cursor-pointer' onClick={data.onClick}>
            <Plus className='text-blue-600 hover:bg-blue-600 hover:text-white rounded-full' />
            <Handle type="source" position={Position.Top} id="a" style={{ display: 'none' }} />
            <Handle type="target" position={Position.Bottom} id="b" style={{ display: 'none' }} />
        </button>
    )
}

export function CustomEdge ({ id, sourceX, sourceY, targetX, targetY }) {
    const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
 
  return (<BaseEdge id={id} path={edgePath} />);
}
