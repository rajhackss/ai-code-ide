export default async function run() {
    const response = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            compiler: 'openjdk-jdk-22+36',
            code: 'public class Main { public static void main(String[] args) { System.out.println("Hello from Wandbox"); } }'.replace(/public\s+class\s+Main\s*\{/, 'class Main {'),
            save: false
        })
    });
    console.log(await response.json());
}
run();
