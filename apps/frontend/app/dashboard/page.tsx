"use client";
import { Appbar } from "@/components/Appbar";
import { DarkButton } from "@/components/buttons/DarkButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL, HOOKS_URL } from "../config";
// import { LinkButton } from "@/components/buttons/LinkButton";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge, Calendar, Copy, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Zap {
  id: string;
  triggerId: string;
  userId: number;
  actions: {
    id: string;
    zapId: string;
    actionId: string;
    sortingOrder: number;
    type: {
      id: string;
      name: string;
      image: string;
    };
  }[];
  trigger: {
    id: string;
    zapId: string;
    triggerId: string;
    type: {
      id: string;
      name: string;
      image: string;
    };
  };
}

function useZaps() {
  const [loading, setLoading] = useState(true);
  const [zaps, setZaps] = useState<Zap[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/zap`, { withCredentials: true })
      .then((res) => {
        setZaps(res.data.zaps);
        setLoading(false);
      });
  }, []);

  return {
    loading,
    zaps,
  };
}

export default function Dashboard() {
  const { loading, zaps } = useZaps();
  const router = useRouter();

  return (
    <>
      <div>
        {loading && <Loader />}
        <Appbar />
        {/* <div className="flex justify-center pt-8">
        <div className="max-w-screen-lg	 w-full">
          <div className="flex justify-between pr-8 ">
            <div className="text-2xl font-bold">My Zaps</div>
            <DarkButton
              onClick={() => {
                router.push("/zap/create");
              }}
            >
              Create
            </DarkButton>
          </div>
        </div>
      </div> */}
        <div className="flex justify-center">
          {" "}
          <ZapTable zaps={zaps} />{" "}
        </div>
      </div>
    </>
  );
}

function ZapTable({ zaps }: { zaps: Zap[] }) {
  const handleNavigate = (zapId: string) => {
    router.push(`/zap/${zapId}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  const router = useRouter();

  return (
    // <div className="p-8 max-w-screen-lg w-full">
    //   <div className="flex">
    //     <div className="flex-1">Name</div>
    //     <div className="flex-1">ID</div>
    //     <div className="flex-1">Created at</div>
    //     <div className="flex-1">Webhook URL</div>
    //     <div className="flex-1">Go</div>
    //   </div>
    //   {zaps.map((z, ind) => (
    //     <div key={ind} className="flex border-b border-t py-4">
    //       <div className="flex-1 flex">
    //         <img src={z.trigger.type.image} alt="image" className="w-[30px] h-[30px]" />{" "}
    //         {z.actions.map((x, ind) => (
    //           <img key={ind} src={x.type.image} alt="image" className="w-[30px] h-[30px]" />
    //         ))}
    //       </div>
    //       <div className="flex-1">{z.id}</div>
    //       <div className="flex-1">Nov 13, 2023</div>
    //       <div className="flex-1">{`${HOOKS_URL}/hooks/catch/1/${z.id}`}</div>
    //       <div className="flex-1">
    //         <LinkButton
    //           onClick={() => {
    //             router.push("/zap/" + z.id);
    //           }}
    //         >
    //           Go
    //         </LinkButton>
    //       </div>
    //     </div>
    //   ))}
    // </div>
    <div className="p-6 max-w-screen-xl w-full mx-auto">
      <div className="mb-6 flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            My Zaps
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your automated workflows
          </p>
        </div>
        <Button
          className="bg-[#695be8] hover:bg-[#503ebd]"
          onClick={() => {
            router.push("/zap/create");
          }}
        >
          <Plus className="h-3 w-3" />Create
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Workflow</TableHead>
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
              <TableHead className="font-semibold">Webhook URL</TableHead>
              <TableHead className="font-semibold w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zaps.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No zaps found. Create your first automation!
                </TableCell>
              </TableRow>
            ) : (
              zaps.map((zap) => (
                <TableRow key={zap.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center -space-x-2">
                        <div className="relative">
                          <img
                            src={zap.trigger.type.image}
                            alt="trigger"
                            className="w-8 h-8 rounded-full border-2 border-background shadow-sm bg-white"
                          />
                        </div>
                        {/* <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full border-2 border-background z-10">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div> */}
                        {zap.actions.map((action, index) => (
                          <div key={index} className="relative">
                            <img
                              src={action.type.image}
                              alt="action"
                              className="w-8 h-8 rounded-full border-2 border-background shadow-sm bg-white"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {zap.name || `Zap ${zap.id.slice(0, 8)}...`}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {zap.actions.length + 1} step
                          {zap.actions.length > 0 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className="font-mono text-xs">
                        {zap.id.slice(0, 8)}...
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(zap.id)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {"24 NOV 2024"}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono max-w-[200px] truncate">
                        {`${HOOKS_URL}/hooks/catch/1/${zap.id}`}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() =>
                          copyToClipboard(
                            `${HOOKS_URL}/hooks/catch/1/${zap.id}`
                          )
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleNavigate(zap.id)}
                        className="h-8"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
