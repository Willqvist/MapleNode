#include <stdlib.h>
#include <stdio.h>
#include <limits.h>
// An item to be sorted.
// The value field is just a placeholder.
struct item {
   int key;
   int value;
};


// Semi-open range [lo, hi) of integers.
// The range might be empty (lo = hi).
struct range {
   int lo;
   int hi;
};


struct parts {
   // The first sub-segment.
   struct range first;
   // The second sub-segment.
   struct range second;
};

int reads = 0;
// Partition method #2.
struct parts partition(int n, struct item seg[n])
{
   // Initialize
   const int bound = seg[n - 1].key;
   const struct item work = seg[n - 1];
   int lo = 0;
   int up = n - 1;

   // Loop until partitioned
   while (lo < up) {
       // Scan the low pointer upward
       while (lo < up && seg[lo].key <= bound) {
           reads++;
           lo += 1;
       }
      if(lo < up)
       {
         reads++;
       }
       if (lo < up) {
           seg[up] = seg[lo];
           reads++;
           up -= 1;
       }

       // Scan the high pointer downward
       while (lo < up && seg[up].key >= bound) {
          reads++;
           up -= 1;
       }
       if(lo < up)
       {
         reads++;
       }
       if (lo < up) {
          seg[lo] = seg[up];
           reads++;
           lo += 1;
       }
   }

   // Replace the item which yielded the bound
   reads += 2;
   seg[lo] = work;
   lo += 1;

   // Return the two segments (sans the item in between which yielded the bound)
   return (struct parts) {
       .first  = {  0, up },
       .second = { lo,  n }
   };
}
void quicksort(int n, struct item seg[n])
{
   // Base case
   if (n < 2) {
       return;
   }
   // Recursive case
   struct parts parts = partition(n, seg);
   quicksort(parts.first .hi - parts.first .lo, &seg[parts.first .lo]);
   quicksort(parts.second.hi - parts.second.lo, &seg[parts.second.lo]);
}
int rand_max(int max)
{
    unsigned long x;
    x = rand();
    x <<= 15;
    x ^= rand();
    x %= 10000001;
    return x;
}
int main(int args,char** argv)
{
  srand(atoi(argv[1]));
    
   //struct item data* = {{.key=1},{.key=3},{.key=2},{.key=6},{.key=5},{.key=7},{.key=4},{.key=12},{.key=9},{.key=11},{.key=10},{.key=14},{.key=13},{.key=15},{.key=8}};
   int size = 11;
   int element_size[] ={1000,2000,4000,8000,16000,32000,64000,128000,256000,512000,1024000};
   int reads_data[] ={0,0,0,0,0,0,0,0,0,0,0};
   for(int j = 0; j< size; j++)
   {
    int max=0, min = 0,medel=0;
    for(int k = 0; k < 100; k++)
    {
        int sorted = 0;
        int c_s = element_size[j];
        struct item* data = malloc(sizeof(struct item)*c_s);
        for(int a = 0; a < c_s; a++)
        {
            //printf("wew %d\n",a);
            data[a] = (struct item){.key = rand_max(1000000000)};
        }
        reads = 0;
        quicksort(c_s,data);
        medel += reads/100;
        if(k == 0)
        {
            min=reads;
            max=reads;
            medel = reads/100;
        }
        //printf("operations %d\n",reads);
        if(reads > max)
            max = reads;
        else if(reads < min)
            min = reads;
        for(int i = 1; i < c_s; i++)
        {
            if(data[i].key < data[i-1].key)
            {
            sorted = 0;
            break;
            }
        }
        if(sorted==1)
        {
            printf("something went wrong!\n");
        }
        free(data);
    }
    printf("min=%d, max=%d, medel=%d, all=%d\n",min,max,medel,element_size[j]);
   }
   printf("\n");
   return 0;
}