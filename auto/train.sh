#!/bin/bash

DEST_DIR=~/Downloads/train && mkdir -p $DEST_DIR && echo "Create dest dir $DEST_DIR"
if [[ $? -ne 0 ]]; then echo "Failed to create dir $DEST_DIR"; exit 1; fi

SRC_DIR=$(pwd)/for-writers && (cd $SRC_DIR) && echo "Use source dir $SRC_DIR"
if [[ $? -ne 0 ]]; then echo "Failed to use dir $SRC_DIR"; exit 1; fi

echo '' > $DEST_DIR/page.md && echo "Remove $DEST_DIR/page.md" &&
cat $SRC_DIR/pages/contact-*en.md >> $DEST_DIR/page.md && echo "Copy contact to $DEST_DIR" &&
cat $SRC_DIR/pages/faq-*en.md >> $DEST_DIR/page.md && echo "Copy faq to $DEST_DIR" &&
cat $SRC_DIR/pages/how-to-*en.md >> $DEST_DIR/page.md && echo "Copy how-to to $DEST_DIR" &&
cat $SRC_DIR/pages/product-*en.md >> $DEST_DIR/page.md && echo "Copy product to $DEST_DIR" &&
cat $SRC_DIR/pages/license-*en.md >> $DEST_DIR/page.md && echo "Copy license to $DEST_DIR" &&
cat $SRC_DIR/pages/security-*en.md >> $DEST_DIR/page.md && echo "Copy security to $DEST_DIR" &&
echo "Copy all pages to $DEST_DIR/page.md ok"
if [[ $? -ne 0 ]]; then echo "Failed to copy all pages to $DEST_DIR/page.md"; exit 1; fi

echo '' > $DEST_DIR/blog.md && echo "Remove $DEST_DIR/blog.md" &&
cat $SRC_DIR/blog-en/*.md >> $DEST_DIR/blog.md && echo "Copy all blogs to $DEST_DIR/blog.md ok"
if [[ $? -ne 0 ]]; then echo "Failed to copy all blogs to $DEST_DIR/blog.md"; exit 1; fi

echo '' > $DEST_DIR/doc.md && echo "Remove $DEST_DIR/doc.md" &&
cat $SRC_DIR/doc-en-7.0/doc/*.md >> $DEST_DIR/doc.md && echo "Copy all docs to $DEST_DIR/doc.md ok"
if [[ $? -ne 0 ]]; then echo "Failed to copy all docs to $DEST_DIR/doc.md"; exit 1; fi

echo ""
echo "Done"
echo ""
