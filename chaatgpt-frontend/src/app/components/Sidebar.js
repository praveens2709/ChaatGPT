"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsLayoutSidebarInsetReverse } from "react-icons/bs";
import { BiEdit, BiSearch } from "react-icons/bi";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { Modal, Button, Spinner, Dropdown } from "react-bootstrap";
import { createChat, deleteChat } from "../api/gemini/chatService";
import { useChatContext } from "../contexts/chatContext";

export default function Sidebar({ onClose }) {
  const { groupedChats, fetchChats } = useChatContext();
  const [theme, setTheme] = useState("light");
  const [hasInitialized, setHasInitialized] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const handleNewChat = async () => {
    try {
      const newChat = await createChat();
      router.push(`/chat/${newChat._id}`);
    } catch (err) {
      console.error("Error creating new chat", err);
    }
  };

  useEffect(() => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "light";
    setTheme(currentTheme);

    const observer = new MutationObserver(() => {
      const updatedTheme =
        document.documentElement.getAttribute("data-theme");
      setTheme(updatedTheme || "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasInitialized && groupedChats) {
      setHasInitialized(true);
    }
  }, [groupedChats]);

  const logoSrc = theme === "dark" ? "/light-logo.png" : "/dark-logo.png";

  const handleDeleteChat = async () => {
    if (!selectedChatId) return;

    try {
      setIsDeleting(true);
      await deleteChat(selectedChatId);
      setShowDeleteModal(false);
      if (pathname.includes(selectedChatId)) {
        router.push("/");
      } else {
        router.refresh?.();
      }

      await fetchChats();
    } catch (error) {
      console.error("Error deleting chat:", error);
    } finally {
      setSelectedChatId(null);
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown")) {
        setSelectedChatId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      className="d-flex flex-column"
      style={{
        minWidth: "260px",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      <div className="p-3 ps-4 d-flex align-items-center justify-content-between">
        <BsLayoutSidebarInsetReverse
          style={{ cursor: "pointer", fontSize: "22px" }}
          onClick={onClose}
        />
        <div className="d-flex gap-3 ms-auto">
          <BiSearch
            style={{ cursor: "pointer", fontSize: "24px", marginTop: "1px" }}
            onClick={() => console.log("Search clicked")}
          />
          <BiEdit
            style={{ cursor: "pointer", fontSize: "24px" }}
            onClick={handleNewChat}
          />
        </div>
      </div>

      <div className="ps-4 pe-3 py-2 d-flex align-items-center gap-2 fw-bold">
        <img src={logoSrc} alt="logo" width={26} height={26} />
        <span>ChaatGPT</span>
      </div>

      <div className="overflow-auto flex-grow-1 ps-4 pe-3 py-1">
        {isDeleting ? (
          <div
            className="d-flex justify-content-center pt-3"
            style={{ height: "100%" }}
          >
            <Spinner
              animation="border"
              style={{ color: "var(--muted-color)" }}
              size="sm"
            />
          </div>
        ) : !hasInitialized ? (
          <div
            className="d-flex justify-content-center pt-3"
            style={{ height: "100%" }}
          >
            <Spinner
              animation="border"
              style={{ color: "var(--muted-color)" }}
              size="sm"
            />
          </div>
        ) : Object.keys(groupedChats).length === 0 ? (
          <div className="small mt-3" style={{ color: "var(--muted-color)" }}>
            No chats yet. Start a new one!
          </div>
        ) : (
          Object.entries(groupedChats).map(([label, chats]) => (
            <div key={label} className="mb-3">
              <div
                className="small mb-2"
                style={{ color: "var(--muted-color)" }}
              >
                {label}
              </div>
              {chats.map((chat) => {
                const isActive = pathname.includes(chat._id);
                return (
                  <div
                    key={chat._id}
                    className={`chat-item rounded-3 px-2 py-2 d-flex justify-content-between align-items-center ${isActive ? "chat-active" : "chat-hover"
                      }`}
                    style={{ cursor: "pointer", color: "var(--text-color)" }}
                    onClick={() => router.push(`/chat/${chat._id}`)}
                  >
                    <div className="flex-grow-1 pe-3">
                      {chat.title || "Untitled"}
                    </div>
                    <Dropdown align="end" show={selectedChatId === chat._id}>
                      <Dropdown.Toggle
                        as="div"
                        className="p-0 d-flex align-items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedChatId(selectedChatId === chat._id ? null : chat._id);
                        }}
                      >
                        <IoEllipsisHorizontal
                          className="ellipsis-icon"
                          style={{
                            color: "var(--muted-color)",
                            cursor: "pointer",
                          }}
                        />
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        style={{
                          backgroundColor: "var(--input-color)",
                        }}
                      >
                        <Dropdown.Item
                          style={{
                            color: "var(--text-color)",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setSelectedChatId(null);
        }}
        centered
      >
        <Modal.Body
          style={{
            backgroundColor: "var(--input-color)",
            color: "var(--text-color)",
            borderTopLeftRadius: "6px",
            borderTopRightRadius: "6px"
          }}
        >
          This action cannot be undone. Are you sure you want to delete this chat?
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: "var(--input-color)",
            borderTop: "1px solid var(--muted-color)",
          }}
        >
          <Button
            variant="transparent"
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedChatId(null);
            }}
            style={{
              border: " 1px solid var(--muted-color)",
              borderRadius: "8px",
              color: "var(--muted-color)"
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDeleteChat();
              setShowDeleteModal(false);
            }}
            style={{
              borderRadius: "8px"
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <style global jsx>{`
        .chat-item .ellipsis-icon {
          opacity: 0;
          transition: opacity 0.2s ease;
          color: var(--muted-color);
        }
        .chat-item:hover .ellipsis-icon {
          opacity: 1;
        }

        .dropdown-toggle::after {
          display: none !important;
        }

        .dropdown-menu {
          z-index: 1055 !important; /* Above modal backdrop, just in case */
        }
      `}</style>
    </div>
  );
}
