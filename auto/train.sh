
TARGET=~/Downloads/train
echo "Train target: $TARGET"

rm -f $TARGET/*.md

echo ""
echo "Train one file:"
DIRS=(~/git/srs-docs/for-writers/doc-en-6.0/doc \
    ~/git/srs-docs/for-writers/blog-en \
    ~/git/srs-docs/for-writers/pages\
)
for dir in ${DIRS[*]}; do
    cd $dir
    files=$(ls *.md |grep -iv zh)
    for file in $files; do
        echo $file; echo "SRS Server File: $file" >> $TARGET/srs-one.md; cat $file >> $TARGET/srs-one.md
    done
done

echo ""
echo "Train SRS server files:"
cd ~/git/srs-docs/for-writers/doc-en-6.0/doc
FILES=(drm.md dvr.md edge.md exporter.md ffmpeg.md flv.md forward.md gb28181.md \
    getting-started-build.md getting-started-k8s.md getting-started.md hevc.md hls.md \
    http-api.md http-callback.md http-server.md ingest.md introduction.md k8s.md \
    learning-path.md log-rotate.md log.md low-latency.md nginx-exec.md nginx-for-hls.md \
    origin-cluster.md reload.md rtmp.md security.md service.md snapshot.md srt.md \
    streamer.md webrtc.md windows.md \
)
for file in ${FILES[*]}; do
    echo $file; echo "SRS Server File: $file" >> $TARGET/srs-server.md; cat $file >> $TARGET/srs-server.md
done

echo ""
echo "Train SRS extra files:"
DIRS=(~/git/srs-docs/for-writers/doc-en-6.0/doc \
    ~/git/srs-docs/for-writers/blog-en \
    ~/git/srs-docs/for-writers/pages\
)
for dir in ${DIRS[*]}; do
    cd $dir
    files=$(ls *.md |grep -iv zh |grep -iv stack)
    for file in $files; do
        if [[ $(grep -q "File: $file" $TARGET/srs-server.md && echo ignore) == ignore ]]; then
            continue
        fi
        echo $file; echo "SRS Server File: $file" >> $TARGET/srs-extra.md; cat $file >> $TARGET/srs-extra.md
    done
done

echo ""
echo "Train SRS Stack files:"
for dir in ${DIRS[*]}; do
    cd $dir
    files=$(ls *.md |grep -iv zh |grep -i stack)
    for file in $files; do
        if [[ $(grep -q "File: $file" $TARGET/srs-server.md && echo ignore) == ignore ]]; then
            continue
        fi
        echo $file; echo "SRS Stack File: $file" >> $TARGET/srs-stack.md; cat $file >> $TARGET/srs-stack.md
    done
done

echo ""
echo "Train files:"
echo "ls -lh $TARGET/*.md"
cd $TARGET && ls -lh *.md
