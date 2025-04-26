#!/bin/bash

# recursive_decompress.sh
# ----------------------
# This script takes an encoded or compressed file (e.g. .txt holding hex dump, .gz, .bz2, .tar)
# and fully unpacks it through all nested layers until a plain-text payload remains.

# Usage: ./recursive_decompress.sh <input-file>

# Step 1: Copy input into an isolated temporary working directory
filename="$1"                              # original path provided by user
tmp_dir=$(mktemp -d)                         # create a unique temp directory
cp "$filename" "$tmp_dir"                # copy the file in
cd "$tmp_dir"                              # switch into temp directory

# Step 2: Track the current file name and its original extension
current_filename="$tmp_dir/$(ls)"          # there should be exactly one file here
current_extension="${filename##*.}"        # extension of the original filename

# update_current_filename: refresh the name after each extraction step
update_current_filename() {
    current_filename="$tmp_dir/$(ls)"
}

# enum_file_mime_type: detect the MIME type of $f, rename and decompress accordingly
enum_file_mime_type() {
    # detect MIME type (e.g. application/gzip, application/x-bzip2, application/x-tar)
    file_mime=$(file -i "$f" | cut -d ' ' -f 2 | cut -d ';' -f 1)

    case "$file_mime" in
        application/gzip)
            # handle gzip: append .gz, then gunzip in place
            ext="gz"
            mv "$f" "$f.$ext"
            gunzip "$f.$ext"         # decompress, removes .gz automatically
            ;;

        application/x-bzip2)
            # handle bzip2: append .bz2, decompress via bzcat
            ext="bz2"
            mv "$f" "$f.$ext"
            bzcat "$f.$ext" > "$f"  # write decompressed data back to original name
            rm -f "$f.$ext"           # clean up compressed file
            ;;

        application/x-tar)
            # handle tar: append .tar, extract contents into cwd
            ext="tar"
            mv "$f" "$f.$ext"
            tar xvf "$f.$ext" &>/dev/null
            rm -f "$f.$ext"           # remove the tar after extraction
            ;;

        *)
            # unsupported type: nothing to do
            ;;
    esac

    # after any change, refresh current_filename to the newly produced file
    update_current_filename
}

# main: repeatedly inspect current_filename until it becomes plain text
main() {
    update_current_filename
    # loop until file identifies as text/plain
    while [[ $(file -i "$current_filename" | cut -d ' ' -f 2 | cut -d ';' -f 1) != "text/plain" ]]; do
        export f=$current_filename      # set global variable for enum_file_mime_type
        enum_file_mime_type             # rename & decompress one layer
    done
}

# Special case: if original file was .txt (hex dump), convert back to binary first
if [[ $current_extension == "txt" ]]; then
    update_current_filename
    xxd -r "$current_filename" > "$tmp_dir/data2.bin"  # reverse hex dump to binary
    rm -f *.txt                                          # remove hex dump files
    main                                                # then enter main extraction loop
else
    main                                                # otherwise just start extraction loop
fi

# Once fully decompressed, output the final text payload
cat "$tmp_dir/$(ls)"

# Clean up: remove temporary directory and return to original cwd
rm -rf "$tmp_dir"
cd - &>/dev/null
#!/bin/bash

# recursive_decompress.sh
# ----------------------
# This script takes an encoded or compressed file (e.g. .txt holding hex dump, .gz, .bz2, .tar)
# and fully unpacks it through all nested layers until a plain-text payload remains.

# Usage: ./recursive_decompress.sh <input-file>

# Step 1: Copy input into an isolated temporary working directory
filename="$1"                              # original path provided by user
tmp_dir=$(mktemp -d)                         # create a unique temp directory
cp "$filename" "$tmp_dir"                # copy the file in
cd "$tmp_dir"                              # switch into temp directory

# Step 2: Track the current file name and its original extension
current_filename="$tmp_dir/$(ls)"          # there should be exactly one file here
current_extension="${filename##*.}"        # extension of the original filename

# update_current_filename: refresh the name after each extraction step
update_current_filename() {
    current_filename="$tmp_dir/$(ls)"
}

# enum_file_mime_type: detect the MIME type of $f, rename and decompress accordingly
enum_file_mime_type() {
    # detect MIME type (e.g. application/gzip, application/x-bzip2, application/x-tar)
    file_mime=$(file -i "$f" | cut -d ' ' -f 2 | cut -d ';' -f 1)

    case "$file_mime" in
        application/gzip)
            # handle gzip: append .gz, then gunzip in place
            ext="gz"
            mv "$f" "$f.$ext"
            gunzip "$f.$ext"         # decompress, removes .gz automatically
            ;;

        application/x-bzip2)
            # handle bzip2: append .bz2, decompress via bzcat
            ext="bz2"
            mv "$f" "$f.$ext"
            bzcat "$f.$ext" > "$f"  # write decompressed data back to original name
            rm -f "$f.$ext"           # clean up compressed file
            ;;

        application/x-tar)
            # handle tar: append .tar, extract contents into cwd
            ext="tar"
            mv "$f" "$f.$ext"
            tar xvf "$f.$ext" &>/dev/null
            rm -f "$f.$ext"           # remove the tar after extraction
            ;;

        *)
            # unsupported type: nothing to do
            ;;
    esac

    # after any change, refresh current_filename to the newly produced file
    update_current_filename
}

# main: repeatedly inspect current_filename until it becomes plain text
main() {
    update_current_filename
    # loop until file identifies as text/plain
    while [[ $(file -i "$current_filename" | cut -d ' ' -f 2 | cut -d ';' -f 1) != "text/plain" ]]; do
        export f=$current_filename      # set global variable for enum_file_mime_type
        enum_file_mime_type             # rename & decompress one layer
    done
}

# Special case: if original file was .txt (hex dump), convert back to binary first
if [[ $current_extension == "txt" ]]; then
    update_current_filename
    xxd -r "$current_filename" > "$tmp_dir/data2.bin"  # reverse hex dump to binary
    rm -f *.txt                                          # remove hex dump files
    main                                                # then enter main extraction loop
else
    main                                                # otherwise just start extraction loop
fi

# Clean up: remove temporary directory and return to original cwd
rm -rf "$tmp_dir"
cd - &>/dev/null
