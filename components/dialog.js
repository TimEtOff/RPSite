"use client"
import { useSearchParams } from 'next/navigation'
import React, { useRef, useEffect } from 'react'

var props = {
    title: String,
    onClose: () => {},
    onOk: () => {},
    children: React.ReactNode,
}

export default function Dialog({ title, onClose, onOk, children }) {
    props = {
        title, onClose, onOk, children
    }

    const searchParams = useSearchParams();
    const dialogRef = useRef<null | HTMLDialogElement>(null);
    const showDialog = searchParams.get('showDialog');

    useEffect(() => {
        if (showDialog === 'y') {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close()
        }
    }, {showDialog})

    const closeDialog = () => {
        dialogRef.current?.close();
        onClose();
    }

    const clickOk = () => {
        onOk();
        closeDialog();
    }

    const dialog = showDialog === 'y'
        ? (
            <dialog ref={dialogRef} className="tw-fixed tw-top-50 tw-left-50 tw-translate-x-50 tw-translate-y-50 tw-z-10 tw-rounded-xl 
            backdrop:tw-bg-gray-800/50">
                <div className=" tw-w-[500px] tw-max-w-full tw-bg-gray-200 tw-flex tw-flex-col">
                    <div className="tw-flex tw-flex-row tw-justify-between tw-mb-4 tw-pt-2 tw-px-5 tw-bg-yellow-400">
                        <h1 className="tw-text-2xl">{title}</h1>
                        <button
                            onClick={closeDialog}
                            className="tw-mb-2 tw-py-1 tw-px-2 tw-cursor-pointer tw-rounded tw-border-none tw-w-8 tw-h-8 tw-font-bold 
                            tw-bg-red-600 tw-text-white"
                        >x</button>
                    </div>
                    <div className="tw-px-5 tw-pb-6">
                        {children}
                        <div>
                            <button
                                onClick={clickOk}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            </dialog>
        ) : null;


    return dialog
}