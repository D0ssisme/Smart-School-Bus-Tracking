import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function NotificationForm({ isOpen, onClose, onSubmit, editingNotification }) {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        recipientType: "all"
    });

    useEffect(() => {
        if (editingNotification) {
            setFormData(editingNotification);
        } else {
            setFormData({
                title: "",
                content: "",
                recipientType: "all"
            });
        }
    }, [editingNotification, isOpen]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-blue-900">
                        {editingNotification ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Nhập tiêu đề thông báo"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nội dung <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Nhập nội dung thông báo..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gửi đến <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="recipientType"
                            value={formData.recipientType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            required
                        >
                            <option value="all">Tất cả</option>
                            <option value="parent">Phụ huynh</option>
                            <option value="driver">Tài xế</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Chọn đối tượng nhận thông báo
                        </p>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {editingNotification ? "Cập nhật" : "Gửi thông báo"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default NotificationForm;