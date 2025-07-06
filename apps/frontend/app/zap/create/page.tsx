"use client";

import { BACKEND_URL } from "@/app/config";
import { Input } from "@/components/Input";
// import { ZapCell } from "@/components/ZapCell";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import {
  Background,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import CustomNode, { AddNode, CustomEdge } from "./Node";

function useAvailableActionsAndTriggers() {
  const [availableActions, setAvailableActions] = useState([]);
  const [availableTriggers, setAvailableTriggers] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/trigger/available`)
      .then((x) => setAvailableTriggers(x.data.availableTriggers));

    axios
      .get(`${BACKEND_URL}/api/v1/action/available`)
      .then((x) => setAvailableActions(x.data.availableActions));
  }, []);

  return {
    availableActions,
    availableTriggers,
  };
}

// export default function Page() {
//   const router = useRouter();
//   const { availableActions, availableTriggers } = useAvailableActionsAndTriggers();

//   const [selectedTrigger, setSelectedTrigger] = useState<{
//     id: string;
//     name: string;
//   }>();

//   const [selectedActions, setSelectedActions] = useState<
//     {
//       index: number;
//       availableActionId: string;
//       availableActionName: string;
//       metadata: any;
//     }[]
//   >([]);

//   const [selectedModalIndex, setSelectedModalIndex] = useState<null | number>(null);
//   const idCounter = useRef(2);
//   const containerRef = useRef<HTMLDivElement>(null);

//   interface Edge {
//     id: string;
//     source: string;
//     target: string;
//   }

//   type LabelNodeData = { label: string };
//   type ButtonNodeData = { onClick: () => void };
//   type NodeData = LabelNodeData | ButtonNodeData;

//   type NodeType = {
//     id: string;
//     type?: string;
//     position: { x: number; y: number };
//     data: NodeData;
//   };

//   const getContainerWidth = () => {
//     return containerRef.current ? containerRef.current.clientWidth : 500;
//   };

//   const addNode = () => {
//     const newNodeId = idCounter.current.toString();
//     const lastId = (idCounter.current - 1).toString();
//     const containerWidth = getContainerWidth();

//     const newNode = {
//       id: newNodeId,
//       position: { x: containerWidth / 2 - 75, y: 60 * idCounter.current },
//       data: { label: selectedActions[idCounter.current - 2]?.availableActionName || `Action` },
//     };

//     const newEdge = {
//       id: `e${lastId}-${newNodeId}`,
//       source: lastId,
//       target: newNodeId,
//     };

//     setNodes((nds) => {
//       const filtered = nds.filter((n) => n.id !== 'add-button');

//       return [
//         ...filtered,
//         newNode,
//         {
//           id: 'add-button',
//           type: 'addButton',
//           position: { x: containerWidth / 2 - 25, y: newNode.position.y + 70 },
//           data: { onClick: addNode },
//         },
//       ];
//     });

//     setEdges((eds) => [...eds, newEdge]);
//     idCounter.current += 1;
//   };

//   const initialEdges: Edge[] = [];

//   const initialNodes = [
//     {
//       id: "1",
//       position: { x: 200, y: 50 },
//       data: { label: selectedTrigger?.name ?? "Trigger" },
//     },
//     {
//       id: "add-button",
//       type: "addButton",
//       position: { x: 225, y: 120 },
//       data: { onClick: addNode },
//     },
//   ];

//   const [nodes, setNodes, onNodesChange] = useNodesState<NodeType>(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//   // Update node positions when container size changes
//   useEffect(() => {
//     const updateNodePositions = () => {
//       const containerWidth = getContainerWidth();
//       setNodes((nds) =>
//         nds.map((node) => {
//           if (node.type === 'addButton') {
//             return {
//               ...node,
//               position: { ...node.position, x: containerWidth / 2 - 25 },
//             };
//           } else {
//             return {
//               ...node,
//               position: { ...node.position, x: containerWidth / 2 - 75 },
//             };
//           }
//         })
//       );
//     };

//     const resizeObserver = new ResizeObserver(updateNodePositions);
//     if (containerRef.current) {
//       resizeObserver.observe(containerRef.current);
//     }

//     return () => resizeObserver.disconnect();
//   }, [setNodes]);

//   useEffect(() => {
//     if (selectedTrigger) {
//       setNodes((nds) =>
//         nds.map((node) =>
//           node.id === "1"
//             ? {
//                 ...node,
//                 data: {
//                   ...node.data,
//                   label: selectedTrigger.name,
//                 },
//               }
//             : node
//         )
//       );
//     }
//   }, [selectedTrigger, setNodes]);

//   // Update action node labels when selectedActions change
//   useEffect(() => {
//     setNodes((nds) =>
//       nds.map((node) => {
//         if (node.id !== "1" && node.type !== 'addButton') {
//           const actionIndex = parseInt(node.id) - 2;
//           const action = selectedActions[actionIndex];
//           return {
//             ...node,
//             data: {
//               ...node.data,
//               label: action?.availableActionName || `Action`,
//             },
//           };
//         }
//         return node;
//       })
//     );
//   }, [selectedActions, setNodes]);

//   const AddButtonNode = ({ data }: any) => (
//     <button
//       className="bg-blue-500 text-center text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg hover:bg-blue-600 transition-colors"
//       onClick={data.onClick}
//     >
//       +
//     </button>
//   );

//   const nodeTypes = useMemo(() => ({
//     addButton: AddButtonNode,
//   }), []);

//   return (
//     <div>
//       <Appbar />
//       <div className="flex justify-end bg-slate-200 p-4 pb-0">
//         <PrimaryButton
//           onClick={async () => {
//             if (!selectedTrigger?.id) {
//               return;
//             }

//             console.log({
//                 availableTriggerId: selectedTrigger.id,
//                 triggerMetadata: {},
//                 actions: selectedActions.map((a) => ({
//                   availableActionId: a.availableActionId,
//                   actionMetadata: a.metadata,
//                 })),
//               });

//             const response = await axios.post(
//               `${BACKEND_URL}/api/v1/zap`,
//               {
//                 availableTriggerId: selectedTrigger.id,
//                 triggerMetadata: {},
//                 actions: selectedActions.map((a) => ({
//                   availableActionId: a.availableActionId,
//                   actionMetadata: a.metadata,
//                 })),
//               }, {withCredentials: true}
//             );

//             router.push("/dashboard");
//           }}
//         >
//           Publish
//         </PrimaryButton>
//       </div>
//       <div className="w-full mt-0 min-h-screen bg-slate-200 flex flex-col justify-center">
//         <div ref={containerRef} className="bg-gray-600 mx-auto overflow-y-auto" style={{ width: '90%', minHeight: '500px', maxHeight: '80vh' }}>
//           <ReactFlow
//             nodes={nodes}
//             edges={edges}
//             onNodesChange={onNodesChange}
//             onEdgesChange={onEdgesChange}
//             fitView={false}
//             panOnDrag={false}
//             zoomOnScroll={false}
//             panOnScroll={true}
//             zoomOnDoubleClick={false}
//             zoomOnPinch={false}
//             preventScrolling={false}
//             nodesDraggable={false}
//             nodesConnectable={false}
//             nodeTypes={nodeTypes}
//             defaultViewport={{ x: 0, y: 0, zoom: 1 }}
//             minZoom={1}
//             maxZoom={1}
//             onNodeClick={(event, node) => {
//               if (node.type !== 'addButton') {
//                 setSelectedModalIndex(parseInt(node.id))
//               }
//             }}
//             style={{
//               minHeight: '500px',
//               height: 'auto'
//             }}
//           />
//         </div>
//       </div>
//       {selectedModalIndex && <Modal availableItems={selectedModalIndex === 1 ? availableTriggers : availableActions} onSelect={(props: null | { name: string; id: string; metadata: any; }) => {
//             if (props === null) {
//                 setSelectedModalIndex(null);
//                 return;
//             }
//             if (selectedModalIndex === 1) {
//                 setSelectedTrigger({
//                     id: props.id,
//                     name: props.name
//                 })
//             } else {
//                 setSelectedActions(a => {
//                     const newActions = [...a];
//                     newActions[selectedModalIndex - 2] = {
//                         index: selectedModalIndex,
//                         availableActionId: props.id,
//                         availableActionName: props.name,
//                         metadata: props.metadata
//                     }
//                     return newActions
//                 })
//             }
//             setSelectedModalIndex(null);
//         }} index={selectedModalIndex} />}
//     </div>
//   );
// };

// function Modal({
//   index,
//   onSelect,
//   availableItems,
// }: {
//   index: number;
//   onSelect: (props: null | { name: string; id: string; metadata: any }) => void;
//   availableItems: { id: string; name: string; image: string }[];
// }) {
//   const [step, setStep] = useState(0);
//   const [selectedAction, setSelectedAction] = useState<{
//     id: string;
//     name: string;
//   }>();
//   const isTrigger = index === 1;

//   return (
//     <div className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-slate-100 bg-opacity-70 flex">
//       <div className="relative p-4 w-full max-w-2xl max-h-full">
//         <div className="relative bg-white rounded-lg shadow ">
//           <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
//             <div className="text-xl">
//               Select {index === 1 ? "Trigger" : "Action"}
//             </div>
//             <button
//               onClick={() => {
//                 onSelect(null);
//               }}
//               type="button"
//               className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
//               data-modal-hide="default-modal"
//             >
//               <svg
//                 className="w-3 h-3"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 14 14"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
//                 />
//               </svg>
//               <span className="sr-only">Close modal</span>
//             </button>
//           </div>
//           <div className="p-4 md:p-5 space-y-4">
//             {step === 1 && selectedAction?.id === "email" && (
//               <EmailSelector
//                 setMetadata={(metadata) => {
//                   onSelect({
//                     ...selectedAction,
//                     metadata,
//                   });
//                 }}
//               />
//             )}

//             {step === 1 && selectedAction?.id === "send-sol" && (
//               <SolanaSelector
//                 setMetadata={(metadata) => {
//                   onSelect({
//                     ...selectedAction,
//                     metadata,
//                   });
//                 }}
//               />
//             )}

//             {step === 0 && (
//               <div>
//                 {availableItems.map(({ id, name, image }) => {
//                   return (
//                     <div
//                       key={id}
//                       onClick={() => {
//                         if (isTrigger) {
//                           onSelect({
//                             id,
//                             name,
//                             metadata: {},
//                           });
//                         } else {
//                           setStep((s) => s + 1);
//                           setSelectedAction({
//                             id,
//                             name,
//                           });
//                         }
//                       }}
//                       className="flex border p-4 cursor-pointer hover:bg-slate-100"
//                     >
//                       <img
//                         src={image}
//                         alt=""
//                         width={30}
//                         height={30}
//                         className="rounded-full"
//                       />{" "}
//                       <div className="flex flex-col justify-center">
//                         {" "}
//                         {name}{" "}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

const nodeTypes = {
  customNode: CustomNode,
  addNode: AddNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

type LabelNodeData = { label: string; index?: number };
type ButtonNodeData = { onClick: () => void };
type NodeData = LabelNodeData | ButtonNodeData;

type NodeType = {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: NodeData;
};

type EdgeType = {
  id: string;
  type?: string;
  source: string;
  target: string;
};

export default function Page() {
  const { availableActions, availableTriggers } =
    useAvailableActionsAndTriggers();
  const idCounter = useRef(3);
  const ref = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeType>([]);

  useEffect(() => {
    if (ref.current) {
      const { clientWidth, clientHeight } = ref.current;
      const initialNode = [
        {
          id: "1",
          type: "customNode",
          position: { x: (clientWidth - 270) / 2, y: (clientHeight - 100) / 2 },
          data: { label: "ab", index: 1 },
        },
        {
          id: "2",
          type: "addNode",
          position: { x: (clientWidth - 15) / 2, y: clientHeight / 2 + 20 },
          data: { onClick: addNextNode },
        },
      ];

      setNodes(initialNode);
      setEdges([{ id: "1->2", type: "customEdge", source: "1", target: "2" }]);
    }
  }, []);

  // const addNextNode = () => {
  //   const clientWidth = ref.current?.clientWidth ?? 1000;
  //   // const clientHeight = ref.current?.clientHeight ?? 500;
  //   const ind = idCounter.current;

  //   const lastAddNode = nodes.filter((n) => n.type === "addNode").slice(-1)[0];
  //   const baseY = lastAddNode ? lastAddNode.position.y + 150 : 100

  //   const pairNode = [
  //     {
  //       id: String(ind),
  //       type: "customNode",
  //       position: { x: (clientWidth - 270) / 2, y: baseY},
  //       data: { label: "ab", index: 1 },
  //     },
  //     {
  //       id: String(ind + 1),
  //       type: "addNode",
  //       position: { x: (clientWidth - 15) / 2, y: baseY + 40 },
  //       data: { onClick: addNextNode },
  //     },
  //   ];
  //   setNodes((prev) => [...prev, ...pairNode]);

  //   const edges = [
  //     {
  //       id: `${ind - 1}->${ind}`,
  //       type: "customEdge",
  //       source: String(ind - 1),
  //       target: String(ind),
  //     },
  //     {
  //       id: `${ind}->${ind+1}`,
  //       type: "customEdge",
  //       source: String(ind),
  //       target: String(ind+1),
  //     },
  //   ];

  //   setEdges((prev) => [...prev, ...edges]);
  //   idCounter.current = idCounter.current + 2;
  // };

const addNextNode = () => {
  const clientWidth = ref.current?.clientWidth ?? 1000;
console.log("addd")
  setNodes((prev) => {
    const ind = idCounter.current;
    const lastAddNode = prev.filter((n) => n.type === "addNode").at(-1);
    const baseY = lastAddNode ? lastAddNode.position.y + 60 : 100;

    const newPair = [
      {
        id: String(ind),
        type: "customNode",
        position: { x: (clientWidth - 270) / 2, y: baseY },
        data: { label: "ab", index: ind },
      },
      {
        id: String(ind + 1),
        type: "addNode",
        position: { x: (clientWidth - 15) / 2, y: baseY + 70 },
        data: { onClick: addNextNode },
      },
    ];

    setEdges((prevEdges) => [
      ...prevEdges,
      { id: `${ind - 1}->${ind}`, type: "customEdge", source: String(ind - 1), target: String(ind) },
      { id: `${ind}->${ind + 1}`, type: "customEdge", source: String(ind), target: String(ind + 1) },
    ]);
console.log(`${ind - 1}->${ind}`, `${ind}->${ind + 1}`, newPair)
    idCounter.current += 2;

    return [...prev, ...newPair];
  });
};

  return (
    <>
      <div className="h-screen flex flex-col">
        <div className="h-12 px-2 bg-amber-100 flex justify-between items-center">
          <Button className="">Back</Button>
          <Button className="bg-amber-700 hover:bg-amber-800">Publish</Button>
        </div>
        <div className="h-full" ref={ref}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              // onConnect={onConnect}
              // onPaneClick={onPaneClick}
              // onNodeContextMenu={onNodeContextMenu}
              // fitView
            >
              <Background />
            </ReactFlow>
        </div>
      </div>
    </>
  );
}

function EmailSelector({
  setMetadata,
}: {
  setMetadata: (params: any) => void;
}) {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");

  return (
    <div>
      <Input
        label={"To"}
        type={"text"}
        placeholder="To"
        onChange={(e) => setEmail(e.target.value)}
      ></Input>
      <Input
        label={"Body"}
        type={"text"}
        placeholder="Body"
        onChange={(e) => setBody(e.target.value)}
      ></Input>
      <div className="pt-2">
        <PrimaryButton
          onClick={() => {
            setMetadata({
              email,
              body,
            });
          }}
        >
          Submit
        </PrimaryButton>
      </div>
    </div>
  );
}

function SolanaSelector({
  setMetadata,
}: {
  setMetadata: (params: any) => void;
}) {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div>
      <Input
        label={"To"}
        type={"text"}
        placeholder="To"
        onChange={(e) => setAddress(e.target.value)}
      ></Input>
      <Input
        label={"Amount"}
        type={"text"}
        placeholder="To"
        onChange={(e) => setAmount(e.target.value)}
      ></Input>
      <div className="pt-4">
        <PrimaryButton
          onClick={() => {
            setMetadata({
              amount,
              address,
            });
          }}
        >
          Submit
        </PrimaryButton>
      </div>
    </div>
  );
}
